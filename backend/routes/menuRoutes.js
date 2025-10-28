import express from "express";
import { createMenu, deleteMenu, getAllMenus, getMenu, getPopularMenus, updateMenu } from "../controller/menuController.js";

 const menuRouter = express.Router();

 menuRouter.get("/",getAllMenus)
 menuRouter.get("/popular", getPopularMenus)
 menuRouter.get("/:id",getMenu)
 menuRouter.put("/:id",updateMenu)
 menuRouter.delete("/:id",deleteMenu)
 
 


 menuRouter.post("/", createMenu)

 export default menuRouter;