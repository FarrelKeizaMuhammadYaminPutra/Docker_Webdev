// import sequelize from '../../db/connectDB.js';

// Fetch all movies
export const getMovies = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM movies');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch movie by ID with related data
export const getMovieById = async (req, res) => {
  const { id } = req.params;

  const movieQuery = 'SELECT m.*, m.category AS status, m.trailer FROM movies m WHERE m.id = ?';
  const genreQuery = `
    SELECT g.name FROM genres g 
    INNER JOIN movie_genres mg ON g.id = mg.genre_id 
    WHERE mg.movie_id = ?
  `;
  const actorQuery = `
    SELECT a.id, a.name, a.profile_path AS image FROM actors a 
    INNER JOIN movie_actors ma ON a.id = ma.actor_id 
    WHERE ma.movie_id = ?
  `;
  const reviewQuery = 'SELECT * FROM reviews WHERE movie_id = ?';
  const countryQuery = `
    SELECT c.name FROM countries c 
    INNER JOIN movie_countries mc ON c.id = mc.country_id 
    WHERE mc.movie_id = ?
  `;

  try {
    const [movieResult] = await sequelize.query(movieQuery, { replacements: [id] });

    if (movieResult.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movie = movieResult[0];

    const [genreResults] = await sequelize.query(genreQuery, { replacements: [id] });
    movie.genres = genreResults.map(genre => genre.name);

    const [actorResults] = await sequelize.query(actorQuery, { replacements: [id] });
    movie.actors = actorResults;

    const [reviewResults] = await sequelize.query(reviewQuery, { replacements: [id] });
    movie.reviews = reviewResults;

    const [countryResults] = await sequelize.query(countryQuery, { replacements: [id] });
    movie.countries = countryResults.map(country => country.name);

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generic function to fetch movies by category
const fetchMoviesByCategory = async (category, res) => {
  const sql = `
    SELECT m.*, 
           GROUP_CONCAT(DISTINCT g.name) AS genres, 
           GROUP_CONCAT(DISTINCT c.name) AS countries, 
           GROUP_CONCAT(DISTINCT a.name) AS actors 
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN movie_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    LEFT JOIN movie_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    WHERE m.category = ?
    GROUP BY m.id
  `;

  try {
    const [results] = await sequelize.query(sql, { replacements: [category] });
    const movies = results.map(movie => ({
      ...movie,
      genres: movie.genres ? movie.genres.split(',') : [],
      countries: movie.countries ? movie.countries.split(',') : [],
      actors: movie.actors ? movie.actors.split(',') : [],
    }));
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch popular movies
export const getPopularMovies = async (req, res) => {
  const sql = `
    SELECT m.*, 
           GROUP_CONCAT(DISTINCT g.name) AS genres, 
           GROUP_CONCAT(DISTINCT c.name) AS countries, 
           GROUP_CONCAT(DISTINCT a.name) AS actors 
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN movie_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    LEFT JOIN movie_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    WHERE m.rating BETWEEN 7.00 AND 8.50
    GROUP BY m.id
  `;

  try {
    const [results] = await sequelize.query(sql);
    const movies = results.map(movie => ({
      ...movie,
      genres: movie.genres ? movie.genres.split(',') : [],
      countries: movie.countries ? movie.countries.split(',') : [],
      actors: movie.actors ? movie.actors.split(',') : [],
    }));
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch top-rated movies
export const getTopRatedMovies = async (req, res) => {
  const sql = `
    SELECT m.*, 
           GROUP_CONCAT(DISTINCT g.name) AS genres, 
           GROUP_CONCAT(DISTINCT c.name) AS countries, 
           GROUP_CONCAT(DISTINCT a.name) AS actors 
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN movie_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    LEFT JOIN movie_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    WHERE m.rating BETWEEN 8.00 AND 9.99
    GROUP BY m.id
  `;

  try {
    const [results] = await sequelize.query(sql);
    const movies = results.map(movie => ({
      ...movie,
      genres: movie.genres ? movie.genres.split(',') : [],
      countries: movie.countries ? movie.countries.split(',') : [],
      actors: movie.actors ? movie.actors.split(',') : [],
    }));
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch upcoming movies
export const getUpcomingMovies = async (req, res) => {
  const currentYear = new Date().getFullYear();

  const sql = `
    SELECT m.*, 
           GROUP_CONCAT(DISTINCT g.name) AS genres, 
           GROUP_CONCAT(DISTINCT c.name) AS countries, 
           GROUP_CONCAT(DISTINCT a.name) AS actors 
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN movie_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    LEFT JOIN movie_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    WHERE m.year > ?
    GROUP BY m.id
  `;

  try {
    const [results] = await sequelize.query(sql, { replacements: [currentYear] });
    const movies = results.map(movie => ({
      ...movie,
      genres: movie.genres ? movie.genres.split(',') : [],
      countries: movie.countries ? movie.countries.split(',') : [],
      actors: movie.actors ? movie.actors.split(',') : [],
    }));
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch top movies
export const getTopMovies = async (req, res) => {
  const sql = `
    SELECT m.*, 
           GROUP_CONCAT(DISTINCT g.name) AS genres, 
           GROUP_CONCAT(DISTINCT c.name) AS countries, 
           GROUP_CONCAT(DISTINCT a.name) AS actors 
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN movie_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    LEFT JOIN movie_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    WHERE m.category = "popular"
    GROUP BY m.id
    ORDER BY rating DESC
    LIMIT 10
  `;

  try {
    const [results] = await sequelize.query(sql);
    const movies = results.map(movie => ({
      ...movie,
      genres: movie.genres ? movie.genres.split(',') : [],
      countries: movie.countries ? movie.countries.split(',') : [],
      actors: movie.actors ? movie.actors.split(',') : [],
    }));
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search movies
export const searchMovies = async (req, res) => {
  const { query, genres = '', countries = '', years = '', statuses = '' } = req.query;

  let sql = `
    SELECT DISTINCT m.* 
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    LEFT JOIN movie_countries mc ON m.id = mc.movie_id
    LEFT JOIN countries c ON mc.country_id = c.id
    WHERE 1=1
  `;

  const queryParams = [];

  if (query) {
    sql += ' AND (m.title LIKE ?)';
    queryParams.push(`%${query}%`);
  }

  if (genres) {
    const genreList = genres.split(',');
    sql += ` AND g.name IN (${genreList.map(() => '?').join(',')})`;
    queryParams.push(...genreList);
  }

  if (countries) {
    const countryList = countries.split(',');
    sql += ` AND c.name IN (${countryList.map(() => '?').join(',')})`;
    queryParams.push(...countryList);
  }

  if (years) {
    const yearList = years.split(',');
    sql += ` AND m.year IN (${yearList.map(() => '?').join(',')})`;
    queryParams.push(...yearList);
  }

  if (statuses) {
    const statusList = statuses.split(',');
    sql += ` AND m.category IN (${statusList.map(() => '?').join(',')})`;
    queryParams.push(...statusList);
  }

  try {
    const [results] = await sequelize.query(sql, { replacements: queryParams });
    if (results.length === 0) {
      return res.status(404).json({ message: 'No movies found for the given query' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get distinct years
export const getDistinctYears = async (req, res) => {
  console.log('Fetching distinct years...'); // Tambahkan ini
  const sql = 'SELECT DISTINCT year FROM movies ORDER BY year DESC';
  try {
    const [results] = await sequelize.query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching years:', error); // Tambahkan ini
    res.status(500).json({ error: error.message });
  }
};


// Get distinct statuses
export const getDistinctStatuses = async (req, res) => {
  const sql = 'SELECT DISTINCT category FROM movies';
  try {
    const [results] = await sequelize.query(sql);
    const statuses = results.map(row => row.category); // Ambil kategori dari hasil query
    res.status(200).json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function for query responses
const handleQueryResponse = (res, field = null) => (err, results) => {
  if (err) return res.status(500).json({ error: err.message });
  if (field) {
    const data = results.map(row => row[field]);
    return res.status(200).json(data);
  }
  res.status(200).json(results);
};

import sequelize from '../../db/connectDB.js';

// Fungsi untuk menghitung dan memperbarui rata-rata rating pada film
export const updateMovieRating = async (movieId) => {
    const reviewQuery = 'SELECT rating FROM reviews WHERE movie_id = ?';

    try {
        // Ambil semua rating review terkait film
        const [reviews] = await sequelize.query(reviewQuery, { replacements: [movieId] });

        if (reviews.length === 0) {
            // Jika tidak ada review, set rating movie ke null
            await sequelize.query('UPDATE movies SET rating = NULL WHERE id = ?', { replacements: [movieId] });
            return null;
        }

        // Hitung rata-rata rating
        const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
        const avgRating = (totalRating / reviews.length).toFixed(2);

        // Perbarui rating di tabel movies
        await sequelize.query('UPDATE movies SET rating = ? WHERE id = ?', { replacements: [avgRating, movieId] });

        return avgRating;
    } catch (error) {
        console.error('Error updating movie rating:', error);
        throw error;
    }
};
