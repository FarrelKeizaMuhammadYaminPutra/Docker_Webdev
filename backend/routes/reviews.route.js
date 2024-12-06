import express from "express";
import { getReviews, deleteReview } from "../controllers/reviews.controller.js";

const router = express.Router();

// Route to get all reviews (limited to the latest 100 reviews)
router.get("/reviews", getReviews);
router.delete("/reviews/:id", deleteReview)

export default router;
