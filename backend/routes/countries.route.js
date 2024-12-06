import express from "express";
import { getCountries, createCountry, deleteCountry, updateCountry } from "../controllers/countries.controller.js";

const router = express.Router();

// Route to create a new country (you may want to protect it using verifyToken)
router.post("/countries", createCountry);
router.get("/countries", getCountries); // GET request for fetching all countries
router.delete("/countries/:id", deleteCountry); // DELETE request for deleting a country by ID
router.put("/countries/:id", updateCountry); // PUT request for updating a genre by ID

export default router;

