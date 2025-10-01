 import express from "express";
import { createProducts, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controller/productController.js";
 const router = express.Router();

 router.get("/",getAllProducts)
 router.get("/:id",getProduct)
 router.put("/:id",updateProduct)
 router.delete("/:id",deleteProduct)
 


router.post("/",createProducts)

 export default router;