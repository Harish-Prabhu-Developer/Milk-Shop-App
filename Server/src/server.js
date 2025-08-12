import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './Config/db.js';
import router from "./Route/index.js";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/milkapp",router)
// ✅ Serve uploaded files statically
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    //process.exit(1);
  });