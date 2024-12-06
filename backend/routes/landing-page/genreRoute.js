import express from 'express';
import { getGenre } from '../../controllers/landing-page/genreController.js'; // Import controller dengan ESM

const router = express.Router();

router.get('/', getGenre);

export default router; // Ekspor default menggunakan ESM

