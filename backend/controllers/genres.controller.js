import Genre from "../models/genres.model.js";

// Create a new genre
export const createGenre = async (req, res) => {
  let { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ success: false, message: "Genre name is required" });
    }

    // Capitalize the first letter and convert the rest to lowercase
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Check if the genre already exists with the formatted name
    const genreExists = await Genre.findOne({ where: { name } });
    if (genreExists) {
      return res.status(400).json({ success: false, message: "Genre already exists" });
    }

    const newGenre = await Genre.create({ name });

    res.status(201).json({
      success: true,
      message: "Genre created successfully",
      genre: newGenre,
    });
  } catch (error) {
    console.error("Error in createGenre: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET /api/genres
export const getGenres = async (req, res) => {
  const { page = 1, limit = 25 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const genres = await Genre.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']], // Mengurutkan berdasarkan kolom 'name' secara ascending
    });
    res.status(200).json({ genres });
  } catch (error) {
    console.error("Error fetching genres: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// DELETE /api/genres/:id
export const deleteGenre = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the genre exists
    const genre = await Genre.findByPk(id); // Using Sequelize to find by primary key (id)
    if (!genre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }

    // Delete the genre
    await genre.destroy();

    res.status(200).json({
      success: true,
      message: "Genre deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteGenre: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE /api/genres/:id
export const updateGenre = async (req, res) => {
  const { id } = req.params;
  let { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ success: false, message: "Genre name is required" });
    }

    // Capitalize the first letter and convert the rest to lowercase
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Check if the genre exists
    const genre = await Genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }

    // Check if a genre with the new name already exists
    const genreExists = await Genre.findOne({ where: { name } });
    if (genreExists && genreExists.id !== parseInt(id)) {
      return res.status(400).json({ success: false, message: "Genre name already exists" });
    }

    // Update the genre name
    genre.name = name;
    await genre.save();

    res.status(200).json({
      success: true,
      message: "Genre updated successfully",
      genre,
    });
  } catch (error) {
    console.error("Error in updateGenre: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};