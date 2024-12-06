import express from 'express';
import {
    getMovies,
    getMovieById,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getTopMovies,
    searchMovies,
    getDistinctYears,
    getDistinctStatuses,
} from '../../controllers/landing-page/movieController.js'; // Gunakan ESM


const router = express.Router();

// Get all movies
router.get('/movies', getMovies);
router.get('/movies/popular', getPopularMovies);
router.get('/movies/top_rated', getTopRatedMovies);
router.get('/movies/upcoming', getUpcomingMovies);
router.get('/movies/top_movie', getTopMovies);
router.get('/movies/search', searchMovies);
router.get('/movies/years', getDistinctYears);
router.get('/movies/statuses', getDistinctStatuses);

// Get movie by ID
router.get('/movies/:id', getMovieById);

export default router; // Ekspor default dengan ESM

