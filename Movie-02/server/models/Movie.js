import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String },
    description: { type: String, required: true },
    catagory: { type: String, required: true },
    image: { type: String, required: false },
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const Movie = mongoose.models.movie || mongoose.model("movie", movieSchema);

export default Movie;
