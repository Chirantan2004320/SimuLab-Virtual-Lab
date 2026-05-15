import dotenv from "dotenv";

import express from "express";

import cors from "cors";

//import { testDBConnection } from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import progressRoutes from "./Routes/progressRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import facultyRoutes from "./routes/facultyRoutes.js";

import studentRoutes from "./routes/studentRoutes.js";

//import authRoutes from "./routes/authRoutes.js";

//import progressRoutes from "./routes/progressRoutes.js";

import osCodingRoutes from "./routes/osCodingRoutes.js";

import { testDBConnection }
from "./config/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      "http://localhost:3000",

    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/faculty",
  facultyRoutes
);

app.use(
  "/api/student",
  studentRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/progress",
  progressRoutes
);

app.use(
  "/api/os",
  osCodingRoutes
);

testDBConnection();

app.get("/", (req, res) => {

  res.send(
    "SimuLab MySQL API is running..."
  );
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


app.use("/api/ai", aiRoutes);
