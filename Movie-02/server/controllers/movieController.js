import imagekit from "../configs/imageKit.js";
import Movie from "../models/Movie.js";

export const addMovie = async (req, res) => {
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  console.log("PUBLIC KEY:", process.env.IMAGEKIT_PUBLIC_KEY);
  console.log("PRIVATE KEY:", process.env.IMAGEKIT_PRIVATE_KEY);
  console.log("ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);
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
