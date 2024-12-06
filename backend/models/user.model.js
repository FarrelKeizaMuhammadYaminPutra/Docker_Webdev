import { DataTypes } from "sequelize";
import sequelize from "../db/connectDB.js" 

const User = sequelize.define(
  "users",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Sequelize equivalent of Date.now
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    resetPasswordExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true, // Optional field
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true, // Optional field
    },
    role: {
      type: DataTypes.ENUM('Admin', 'User'), // Define role as ENUM with Admin and User values
      allowNull: true,
      defaultValue: null, // Default role is User
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default User;
