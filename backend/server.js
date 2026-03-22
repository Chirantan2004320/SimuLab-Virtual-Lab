import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/Authroutes.js";
import cors from "cors";



const app = express();
app.use(cors());

app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});