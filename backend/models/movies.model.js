import { DataTypes } from "sequelize";
import sequelize from "../db/connectDB.js";
import Genre from "./genres.model.js";
import Actor from "./actors.model.js";
import Country from "./countries.model.js";

// Define Movie model
const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    poster: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    trailer: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM("popular", "top_rated", "upcoming", "top_movies"),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "movies",
  }
);

// Define associations

// Movie has many Genres (many-to-many)
Movie.belongsToMany(Genre, {
  through: "movie_genres", // Intermediate table for the many-to-many relationship
  as: "genres",
  foreignKey: "movie_id",
  otherKey: "genre_id",
  timestamps: false,
});
Genre.belongsToMany(Movie, {
  through: "movie_genres",
  as: "movies",
  foreignKey: "genre_id",
  otherKey: "movie_id",
  timestamps: false,
});

// Movie has many Actors (many-to-many)
Movie.belongsToMany(Actor, {
  through: "movie_actors", // Intermediate table for the many-to-many relationship
  as: "actors",
  foreignKey: "movie_id",
  otherKey: "actor_id",
  timestamps: false,
});
Actor.belongsToMany(Movie, {
  through: "movie_actors",
  as: "movies",
  foreignKey: "actor_id",
  otherKey: "movie_id",
  timestamps: false,
});

// Movie has many Countries (many-to-many)
Movie.belongsToMany(Country, {
  through: "movie_countries", // New intermediate table for Movie-Country many-to-many relationship
  as: "countries",
  foreignKey: "movie_id",
  otherKey: "country_id",
  timestamps: false,
});
Country.belongsToMany(Movie, {
  through: "movie_countries",
  as: "movies",
  foreignKey: "country_id",
  otherKey: "movie_id",
  timestamps: false,
});

export default Movie;


