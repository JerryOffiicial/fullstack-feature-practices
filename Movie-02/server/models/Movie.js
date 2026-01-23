import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Movie = mongoose.models.movie || mongoose.model("movie", movieSchema);

export default Movie;
