import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import countryRoutes from "./routes/countries.route.js";
import genreRoutes from "./routes/genres.route.js";
import actorRoutes from "./routes/actors.route.js";
import movieRoutes from "./routes/movies.route.js"; // Import movie routes
import userRoutes from "./routes/users.route.js"; // Import user routes
import reviewRoutes from "./routes/reviews.route.js";

import movieRoute from "./routes/landing-page/movieRoutes.js"
import genreRoute from "./routes/landing-page/genreRoute.js";
import countryRoute from "./routes/landing-page/countryRoute.js";
import actorRoute from "./routes/landing-page/actorRoute.js";
import reviewRoute from "./routes/landing-page/reviewRoute.js";

// Menentukan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Menggunakan dotenv dengan path yang benar
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", countryRoutes);
app.use("/api", genreRoutes);
app.use("/api", actorRoutes);
app.use("/api", movieRoutes); // Tambahkan movie route ke API
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);

// Route landing-page
app.use("/landing", movieRoute); // Pastikan ini mengarah ke folder landing-page jika sesuai
app.use("/genres", genreRoute);
app.use("/countries", countryRoute);
app.use("/actors", actorRoute);
app.use("/reviews", reviewRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
});

// Start the server and connect to the database
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port: ${PORT}`);
    } catch (error) {
        console.log("Error connecting to the database: ", error);
    }
});


