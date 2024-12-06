import Review from "../models/reviews.model.js";
import Movie from "../models/movies.model.js";
import Country from "../models/countries.model.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      attributes: ["id", "author", "content", "rating"],
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title", "year"], // Atribut dasar dari movie
          include: [
            {
              model: Country,
              as: "countries",
              attributes: ["id", "name"], // Atribut dari country
              through: { attributes: [] }, // Menghilangkan atribut dari tabel perantara
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
      limit: 100,
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the review by ID
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review only (unlinking it from the movie automatically)
    await review.destroy();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
};


