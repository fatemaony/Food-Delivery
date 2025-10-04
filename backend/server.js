import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'



import userRoutes from "./routes/userRoutes.js"
import cartRoutes from './routes/cartRoutes.js'
import menuRoutes from "./routes/menuRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import statsRouter from './routes/statsRouter.js'
import { sql } from './config/db.js'
import { ajt } from './lib/arcjet.js'

dotenv.config()
const app =express()

const PORT= process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.use(async (req, res, next) => {
  try {
    const decision = await ajt.protect(req, { requested: 1 })

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ success: false, message: "Too many requests" })
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ success: false, message: "Bot access denied" })
      }
      return res.status(403).json({ success: false, message: "Forbidden" })
    }

    return next()
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})


app.use("/api/users",userRoutes);
app.use("/api/menus",menuRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats",statsRouter);



async function initDB() {
  try {
   
    // Menu Table
    await sql`
    CREATE TABLE IF NOT EXISTS menus(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // user table (create before reviews due to foreign key)
    await sql`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    image VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Reviews table with rating column
    await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
      user_email VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_image VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    
    // Add rating column if it doesn't exist (for existing databases)
    try {
      await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5)`;
      console.log("Rating column added or already exists");
    } catch (alterError) {
      console.log("Rating column already exists or error adding it:", alterError.message);
    }

     // Enforce one review per user per menu
     try {
       await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_review_per_user_menu ON reviews(menu_id, user_email)`;
       console.log("Unique index for one-review-per-user-per-menu ensured");
     } catch (idxError) {
       console.log("Error creating unique index:", idxError.message);
     }



    //  cart table
    await sql`
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, menu_id) -- one entry per menu per user
    )`;

    await sql`
    CREATE TABLE IF NOT EXISTS user_mapping (
      firebase_uid VARCHAR(255) PRIMARY KEY,
      database_user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    // ordered table

    await sql`
    CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, delivered, cancelled
  payment_method VARCHAR(50), -- cash, card, stripe, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;


  // ---- Order Items ----
  await sql`
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

    console.log("Database initialized successfully")
  } catch (error) {
    console.log("Error initDB",error)
  }
}

initDB().then(()=>{
  app.listen(PORT, ()=>{
    console.log("Food Delivery server is running")
  });
})
