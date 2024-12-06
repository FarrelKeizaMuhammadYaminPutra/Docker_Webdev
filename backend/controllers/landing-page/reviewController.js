import sequelize from '../../db/connectDB.js'; // ESM Import
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import { updateMovieRating } from './movieController.js';

// Fetch all reviews
export const getReview = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM reviews');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Insert new review
export const addReview = async (req, res) => {
  const { movieId, user, rating, text } = req.body;

  // Validasi input
  if (!movieId || !user || !rating || !text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO reviews (movie_id, author, rating, content) VALUES (?, ?, ?, ?)`;

  try {
    // Tambahkan review baru ke database
    await sequelize.query(sql, { replacements: [movieId, user, rating, text] });

    // Panggil fungsi untuk memperbarui rating film
    const avgRating = await updateMovieRating(movieId);

    res.status(201).json({ message: 'Review added successfully', averageRating: avgRating });
  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(500).json({ error: error.message });
  }
};
