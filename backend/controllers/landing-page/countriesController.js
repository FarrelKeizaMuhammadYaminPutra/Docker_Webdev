import sequelize from '../../db/connectDB.js'; // Gunakan ESM

// Fetch all countries
export const getCountry = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM countries');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
