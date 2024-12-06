import express from "express";
import { getActors, addActor, deleteActor, updateActor } from "../controllers/actors.controller.js";
import upload, { setUploadPath } from "../middleware/uploads.js";

const router = express.Router();

router.get("/actors", getActors); // Mendapatkan semua aktor
router.post("/actors", setUploadPath("actors"), upload.single("profile_path"), addActor); // Menambahkan aktor dengan unggahan gambar
router.put("/actors/:id", setUploadPath("actors"), upload.single("profile_path"), updateActor); // Memperbarui aktor dengan unggahan gambar
router.delete("/actors/:id", deleteActor); // Menghapus aktor

export default router;


