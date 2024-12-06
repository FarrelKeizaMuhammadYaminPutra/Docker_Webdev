import express from "express";
import { getGenres, createGenre, deleteGenre, updateGenre} from "../controllers/genres.controller.js";

const router = express.Router();

// Route to create a new genre
router.post("/genres", createGenre);
router.get("/genres", getGenres); // GET request for fetching all genres
router.delete("/genres/:id", deleteGenre); // DELETE request for deleting a genre by ID
router.put("/genres/:id", updateGenre); // PUT request for updating a genre by ID

export default router;