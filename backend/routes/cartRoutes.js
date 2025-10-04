import express from "express";
import { 
  createCart, 
  deleteCart, 
  getAllCarts, 
  updateCartQuantity,
  clearCart
} from "../controller/cartController.js";

const cartRouter = express.Router();

// Get all cart items for a user (use query param: ?userId=123)
cartRouter.get("/", getAllCarts);

// Add item to cart (or update if exists)
cartRouter.post("/", createCart);

// Update cart item quantity
cartRouter.patch("/:id", updateCartQuantity);

// Delete a specific cart item
cartRouter.delete("/:id", deleteCart);

// Clear entire cart for a user
cartRouter.delete("/user/:userId/clear", clearCart);

export default cartRouter;
