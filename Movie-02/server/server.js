import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config"
import movieRouter from "./routes/movieRoutes.js";

const app = express();

await connectDB();

app.use(cors());


app.get("/", (req, res) => res.send("Api is woking"));
app.use("/api/movie", movieRouter)
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is runing on port " + PORT);
});

export default app;
