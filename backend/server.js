import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { testDBConnection } from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import progressRoutes from "./Routes/progressRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";

const app = express();

app.use(cors());  


app.use(express.json());

testDBConnection();

app.get("/", (req, res) => {
  res.send("SimuLab MySQL API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


app.use("/api/ai", aiRoutes);