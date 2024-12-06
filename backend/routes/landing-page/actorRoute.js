import express from 'express';
import { getActor } from '../../controllers/landing-page/actorController.js'; // Import controller dengan ESM

const router = express.Router();

router.get('/', getActor);

export default router; // Ekspor default menggunakan ESM
