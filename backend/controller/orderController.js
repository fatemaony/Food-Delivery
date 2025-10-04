import { sql } from '../config/db.js'
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { cartItems, user_id, user_email } = req.body;

  const line_items = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.menu_name,
        images: [item.menu_image],
        description: item.menu_description,
      },
      unit_amount: Math.round(item.menu_price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/user/orders?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/addcart?canceled=true`,
      customer_email: user_email,
      client_reference_id: user_id.toString(),
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ success: false, message: 'Failed to create payment session.' });
  }
};

export const createOrder = async (req, res) => {
    const { user_id, total_amount, payment_method, items } = req.body;

    if (!user_id || !total_amount || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Missing required order data.' });
    }

    try {
        // Start a transaction
        await sql`BEGIN`;

        // Insert into orders table
        const orderResult = await sql`
            INSERT INTO orders (user_id, total_amount, payment_method, status)
            VALUES (${user_id}, ${total_amount}, ${payment_method || 'card'}, 'confirmed')
            RETURNING id;
        `;
        const orderId = orderResult[0].id;

        // Insert into order_items table
        for (const item of items) {
            await sql`
                INSERT INTO order_items (order_id, menu_id, quantity, price)
                VALUES (${orderId}, ${item.menu_id}, ${item.quantity}, ${item.price});
            `;
        }
        
        // Clear the user's cart
        await sql `DELETE FROM cart WHERE user_id = ${user_id}`;

        // Commit the transaction
        await sql`COMMIT`;

        res.status(201).json({ success: true, message: 'Order created successfully.', data: { id: orderId } });
    } catch (error) {
        // Rollback on error
        await sql`ROLLBACK`;
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order.', error: error.message });
    }
};


export const getMyOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await sql`
      SELECT o.id, o.total_amount, o.status, o.created_at,
             json_agg(json_build_object(
               'menu_name', m.name,
               'quantity', oi.quantity,
               'price', oi.price
             )) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menus m ON oi.menu_id = m.id
      WHERE o.user_id = ${userId}
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({ success: false, message: "Failed to get orders." });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await sql`
      SELECT o.id, u.name as user_name, u.email as user_email, o.total_amount, o.status, o.created_at,
             json_agg(json_build_object(
               'menu_name', m.name,
               'quantity', oi.quantity,
               'price', oi.price
             )) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menus m ON oi.menu_id = m.id
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC;
    `;

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to get all orders." });
  }
};
