import express from "express";
import upload from "../middleware/multer.js";
import {
  addMovie,
  addReview,
  deleteMovieById,
  generateContent,
  getAllMovies,
  getMovieById,
  getMovieReviews,
  togglePublish,
} from "../controllers/movieController.js";
import auth from "../middleware/auth.js";

const movieRouter = express.Router();

movieRouter.post("/add", upload.single("image"), addMovie);
movieRouter.get("/all", getAllMovies);
movieRouter.get("/:movieId", getMovieById);
movieRouter.post("/delete", auth, deleteMovieById);
movieRouter.post("/toggle-publish", auth, togglePublish);
movieRouter.post("/add-review", addReview);
movieRouter.post("/reviews", getMovieReviews);
movieRouter.post("/generate", auth, generateContent);

export default movieRouter;
