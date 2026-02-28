import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./utils/mongodb.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import profileRoutes from "./routes/profile.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

dbConnect()

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Backend API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use("/uploads", express.static("uploads"));

app.use("/api", profileRoutes);
