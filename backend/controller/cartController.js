import {sql} from '../config/db.js'

// Get all cart items for a user
export const getAllCarts = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    // Convert userId to integer if it's a string
    const userIdInt = parseInt(userId);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid User ID format" 
      });
    }

    const cartItems = await sql`
      SELECT 
        c.id,
        c.user_id,
        c.menu_id,
        c.quantity,
        c.created_at,
        c.updated_at,
        m.name as menu_name,
        m.image as menu_image,
        m.description as menu_description,
        m.price as menu_price,
        (m.price * c.quantity) as total_price
      FROM cart c
      JOIN menus m ON c.menu_id = m.id
      WHERE c.user_id = ${userIdInt}
      ORDER BY c.created_at DESC
    `;

    return res.status(200).json({ 
      success: true, 
      data: cartItems,
      itemCount: cartItems.length
    });

  } catch (error) {
    console.error("Error in getAllCarts:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch cart items",
      error: error.message 
    });
  }
};

// Add item to cart or update quantity if already exists
export const createCart = async (req, res) => {
  try {
    const { user_id, menu_id, quantity = 1 } = req.body;

    console.log("Creating cart item:", { user_id, menu_id, quantity }); // Debug log

    // Validation
    if (!user_id || !menu_id) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID and Menu ID are required" 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Quantity must be at least 1" 
      });
    }

    // Convert IDs to integers
    const userIdInt = parseInt(user_id);
    const menuIdInt = parseInt(menu_id);

    if (isNaN(userIdInt) || isNaN(menuIdInt)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid User ID or Menu ID format" 
      });
    }

    // Check if user exists
    const userExists = await sql`
      SELECT id FROM users WHERE id = ${userIdInt}
    `;

    if (userExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if menu exists
    const menuExists = await sql`
      SELECT id, name, price FROM menus WHERE id = ${menuIdInt}
    `;

    if (menuExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }

    // Check if item already in cart
    const existingCart = await sql`
      SELECT id, quantity FROM cart 
      WHERE user_id = ${userIdInt} AND menu_id = ${menuIdInt}
    `;

    let cartItem;

    if (existingCart.length > 0) {
      // Update quantity if item already exists
      const newQuantity = existingCart[0].quantity + quantity;
      
      cartItem = await sql`
        UPDATE cart 
        SET 
          quantity = ${newQuantity},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userIdInt} AND menu_id = ${menuIdInt}
        RETURNING *
      `;

      return res.status(200).json({ 
        success: true, 
        message: "Cart updated successfully",
        data: cartItem[0]
      });
    } else {
      // Insert new cart item
      cartItem = await sql`
        INSERT INTO cart (user_id, menu_id, quantity)
        VALUES (${userIdInt}, ${menuIdInt}, ${quantity})
        RETURNING *
      `;

      return res.status(201).json({ 
        success: true, 
        message: "Item added to cart successfully",
        data: cartItem[0]
      });
    }

  } catch (error) {
    console.error("Error in createCart:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to add item to cart",
      error: error.message 
    });
  }
};

// Update cart item quantity by cart ID
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartId = parseInt(id);
    if (isNaN(cartId)) {
      return res.status(400).json({ success: false, message: "Invalid Cart ID" });
    }

    if (quantity === undefined || quantity === null) {
        return res.status(400).json({ success: false, message: "Quantity is required" });
    }

    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      // The database has a CHECK constraint for quantity > 0
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const updatedCartItem = await sql`
      UPDATE cart
      SET
        quantity = ${newQuantity},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${cartId}
      RETURNING *
    `;

    if (updatedCartItem.length === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: updatedCartItem[0]
    });

  } catch (error) {
    console.error("Error in updateCartQuantity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart quantity",
      error: error.message
    });
  }
};

// Delete a specific cart item by cart ID
export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartId = parseInt(id);

    if (isNaN(cartId)) {
      return res.status(400).json({ success: false, message: "Invalid Cart ID" });
    }

    const deletedItem = await sql`
      DELETE FROM cart
      WHERE id = ${cartId}
      RETURNING *
    `;

    if (deletedItem.length === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully"
    });

  } catch (error) {
    console.error("Error in deleteCart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message
    });
  }
};

// Clear entire cart for a user by user ID
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdInt = parseInt(userId);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    await sql`
      DELETE FROM cart
      WHERE user_id = ${userIdInt}
    `;

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error("Error in clearCart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message
    });
  }
};
