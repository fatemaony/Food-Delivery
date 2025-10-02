import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
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

app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/menus",menuRoutes);
app.use("/api/reviews", reviewRoutes);

async function initDB() {
  try {
    // product table 
    await sql`
    CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    
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

    // Reviews table with user_name column
    await sql`
    CREATE TABLE IF NOT EXISTS reviews(
    id SERIAL PRIMARY KEY,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_image VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    // Add user_name column if it doesn't exist (for existing databases)
    await sql`
    ALTER TABLE reviews 
    ADD COLUMN IF NOT EXISTS user_name VARCHAR(255)
    `;

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