import express from "express";
import {
  adminLogin,
  approveReviewById,
  deletReviewById,
  getAllMoviesAdmin,
  getAllReviews,
  getDashboard,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login",auth, adminLogin);
adminRouter.get("/reviews", auth, getAllReviews);
adminRouter.get("/movies", auth, getAllMoviesAdmin);
adminRouter.post("/delete-review", auth, deletReviewById);
adminRouter.post("/approve-review", auth, approveReviewById);
adminRouter.get("/dashboard", auth, getDashboard);

export default adminRouter;
