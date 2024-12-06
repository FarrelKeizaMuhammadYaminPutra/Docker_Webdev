import express from 'express';
import { getReview, addReview } from '../../controllers/landing-page/reviewController.js'; // Gunakan ESM
import { isAuthenticated } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Define routes
router.get('/', getReview);
router.post('/add', addReview);

export default router; // Ekspor default menggunakan ESM

