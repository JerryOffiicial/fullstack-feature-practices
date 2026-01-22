import express from "express";
import upload from "../middleware/multer.js";
import { addMovie } from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/add", upload.single("image"), addMovie)

export default movieRouter;
