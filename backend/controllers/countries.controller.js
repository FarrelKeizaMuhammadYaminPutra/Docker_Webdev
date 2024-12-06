import Country from "../models/countries.model.js"; // Import the Country model

// Utility function to validate country name
const isValidCountryName = (name) => /^[a-zA-Z\s]+$/.test(name); // Allows letters and spaces only

// Create a new country
export const createCountry = async (req, res) => {
  let { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ success: false, message: "Country name is required" });
    }
    if (!isValidCountryName(name)) {
      return res.status(400).json({ success: false, message: "Country name must contain only letters and cannot include numbers or special characters" });
    }

    // Capitalize the first letter and convert the rest to lowercase
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Check if the country already exists with the formatted name
    const countryExists = await Country.findOne({ where: { name } });
    if (countryExists) {
      return res.status(400).json({ success: false, message: "Country already exists" });
    }

    const newCountry = await Country.create({ name });

    res.status(201).json({
      success: true,
      message: "Country created successfully",
      country: newCountry,
    });
  } catch (error) {
    console.error("Error in createCountry: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/countries
export const getCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [['name', 'ASC']], // Sort alphabetically
    });
    res.status(200).json({ countries });
  } catch (error) {
    console.error("Error fetching countries: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/countries/:id
export const deleteCountry = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the country exists
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }

    // Delete the country
    await country.destroy();

    res.status(200).json({
      success: true,
      message: "Country deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCountry: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE /api/countries/:id
export const updateCountry = async (req, res) => {
  const { id } = req.params;
  let { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ success: false, message: "Country name is required" });
    }
    if (!isValidCountryName(name)) {
      return res.status(400).json({ success: false, message: "Country name must contain only letters and cannot include numbers or special characters" });
    }

    // Capitalize the first letter and convert the rest to lowercase
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Check if the country exists
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }

    // Check if a country with the new name already exists
    const countryExists = await Country.findOne({ where: { name } });
    if (countryExists && countryExists.id !== parseInt(id)) {
      return res.status(400).json({ success: false, message: "Country name already exists" });
    }

    // Update the country name
    country.name = name;
    await country.save();

    res.status(200).json({
      success: true,
      message: "Country updated successfully",
      country,
    });
  } catch (error) {
    console.error("Error in updateCountry: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

