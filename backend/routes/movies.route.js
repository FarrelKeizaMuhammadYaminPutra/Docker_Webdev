import express from "express";
import { createMovie, getMovies, deleteMovie } from "../controllers/movies.controller.js";
import upload, { setUploadPath } from "../middleware/uploads.js";

const router = express.Router();

// Route to create a new movie with a poster upload
router.post("/movies", setUploadPath("movies"), upload.single("poster"), createMovie);

// Route to get movies
router.get("/movies", getMovies); // Fetches all movies

// Route to delete a movie by ID
router.delete("/movies/:id", deleteMovie); // Deletes a specific movie by ID with cascade

export default router;


