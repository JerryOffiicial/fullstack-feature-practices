import express from "express";
import upload from "../middleware/multer.js";
import {
  addMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/add", upload.single("image"), addMovie);
movieRouter.get("/all", getAllMovies);
movieRouter.get("/:movieId", getMovieById);

export default movieRouter;
