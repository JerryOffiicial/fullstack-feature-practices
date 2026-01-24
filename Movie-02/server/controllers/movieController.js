import main from "../configs/gemini.js";
import imagekit from "../configs/imageKit.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

export const addMovie = async (req, res) => {
  try {
    const { title, year, description, category, isPublished } = JSON.parse(
      req.body.movie,
    );

    const imageFile = req.file;

    //Check if all fileds are present
    if (!title || !year || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    //   Upload to ImageKit
    const response = await imagekit.files.upload({
      file: imageFile.buffer.toString("base64"), //multer converts to binary buffer- we need to convert to base64
      fileName: imageFile.originalname,
      folder: "/movies",
    });
    //Generate optimized image URL
    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: 1280 },
      ],
    });

    await Movie.create({
      title,
      year,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
    });

    res.json({ success: true, message: "Movie added successfully" });
  } catch (error) {
    console.error("ADD MOVIE ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isPublished: true });
    res.json({ success: true, movies });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, movie });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteMovieById = async (req, res) => {
  try {
    const { id } = req.body;
    await Movie.findByIdAndDelete(id);

    //Delete Review fn
    await Review.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.json({ success: false, message: "Movie not found" });
    }
    movie.isPublished = !movie.isPublished;
    await movie.save();
    res.json({ success: true, message: "Movie status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { movie, name, content } = req.body;
    await Review.create({ movie, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.body;
    const reviews = await Review.find({
      movie: movieId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(prompt + " Generate a movie content for this topic in simple text format");

    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
