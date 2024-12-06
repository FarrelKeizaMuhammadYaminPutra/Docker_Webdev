import sequelize from '../../db/connectDB.js'; // Gunakan ESM

// Fetch all actors
export const getActor = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM actors');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

