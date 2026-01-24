import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.json({ success: true, token , message: "Login Successfull"});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllMoviesAdmin = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ createdAt: -1 }); //shows the newest ones first
    res.json({ success: true, movies });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("movie")
      .sort({ createdAt: -1 }); //populate("movie") replaces the movie ID in each comment with the actual blog document.
    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentMovies = await Movie.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    const movies = await Movie.countDocuments();
    const reviews = await Review.countDocuments();
    const drafts = await Movie.countDocuments({ isPublished: false });

    const dashboardData = {
      movies,
      reviews,
      drafts,
      recentMovies,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deletReviewById = async (req, res) => {
  try {
    const { id } = req.body;
    await Review.findByIdAndDelete(id);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const approveReviewById = async (req, res) => {
  try {
    const { id } = req.body;
    await Review.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Review approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
