import { DataTypes } from "sequelize";
import sequelize from "../db/connectDB.js";

const Genre = sequelize.define(
  "genres",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Assuming name should be unique
    },
  },
  {
    timestamps: false, // If there is no createdAt or updatedAt in your table
  }
);

export default Genre;