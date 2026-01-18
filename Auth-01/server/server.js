import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 3000;
connectDB();

const allowedOrigins = ["http://localhost:5173"];

//middleWare
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

//API Endpoints
app.get("/", (req, res) => {res.send("API is working...")});
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
