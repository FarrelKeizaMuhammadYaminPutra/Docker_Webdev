import { DataTypes } from "sequelize";
import sequelize from "../db/connectDB.js";
import Movie from "./movies.model.js";

// Define Review model
const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Movie, // Referensi ke model Movie
        key: "id",    // Menghubungkan ke kolom id pada tabel movies
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
    },
  },
  {
    timestamps: false, // Menambahkan kolom createdAt dan updatedAt
  }
);

// Membuat asosiasi antara Review dan Movie
Movie.hasMany(Review, {
  foreignKey: "movie_id",
  as: "reviews",
});
Review.belongsTo(Movie, {
  foreignKey: "movie_id",
  as: "movie",
});

export default Review;


