import Actor from "../models/actors.model.js";

// GET /api/actors - Fetch all actors with optional pagination
export const getActors = async (req, res) => {
  try {
    // Get the total count of actors first
    const totalActors = await Actor.count();

    // Fetch the latest 100 actors based on id in descending order
    const actors = await Actor.findAll({
      limit: 100,
      order: [["id", "DESC"]], // Order by ID in descending order to get the most recent entries
    });

    res.status(200).json({
      success: true,
      totalCount: totalActors,
      actors,
    });
  } catch (error) {
    console.error("Error fetching actors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const addActor = async (req, res) => {
  console.log("File received:", req.file); // Debugging log
  const { name } = req.body;
  const profile_path = req.file ? `uploads/actors/${req.file.filename}` : null;

  if (!name || !profile_path) {
    return res.status(400).json({
      success: false,
      message: "Both name and profile picture are required.",
    });
  }

  try {
    const newActor = await Actor.create({ name, profile_path });
    res.status(201).json({
      success: true,
      message: "Actor added successfully!",
      actor: newActor,
    });
  } catch (error) {
    console.error("Error adding actor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateActor = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const profile_path = req.file ? `uploads/actors/${req.file.filename}` : null;

  try {
    const actor = await Actor.findByPk(id);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Actor not found" });
    }

    // Update only the fields provided
    if (name) actor.name = name;
    if (profile_path) actor.profile_path = profile_path;

    await actor.save();

    res.status(200).json({
      success: true,
      message: "Actor updated successfully!",
      actor,
    });
  } catch (error) {
    console.error("Error updating actor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteActor = async (req, res) => {
  const { id } = req.params;

  try {
    const actor = await Actor.findByPk(id);
    if (!actor) {
      return res
        .status(404)
        .json({ success: false, message: "Actor not found" });
    }

    await actor.destroy();
    res
      .status(200)
      .json({ success: true, message: "Actor deleted successfully" });
  } catch (error) {
    console.error("Error deleting actor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
