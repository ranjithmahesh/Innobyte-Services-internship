import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; // Use || instead of |
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).json("hi there ");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
