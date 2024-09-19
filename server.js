import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import listRoutes from "./routes/list.route.js";
import reviewsRoutes from "./routes/review.route.js";

import { connectDB } from "./config.js";

dotenv.config();

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "*", credentials: true }))

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/reviews", reviewsRoutes);

app.listen(process.env.PORT, () => {
     console.log("Server is running on port " + process.env.PORT);
     connectDB();
})