import express from "express";
import { createReview, deleteReview, getReviewsByMenu, updateReview, } from "../controller/reviewController.js";

const reviewRouter = express.Router();

// GET reviews for a specific menu
reviewRouter.get("/menu/:menuId", getReviewsByMenu);

// POST create a review
reviewRouter.post("/", createReview);

// DELETE review by id (optional admin feature)
reviewRouter.delete("/:id", deleteReview);

// PUT update a review by id (owner-only)
reviewRouter.put("/:id", updateReview);

export default reviewRouter;


