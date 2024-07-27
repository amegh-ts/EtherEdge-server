const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 5000;

app.use(cors());
dotenv.config();

const userRoutes = require("./routes/UserRoutes");

mongoose.connect(process.env.Mongo_Key).then(() => {
  console.log("Database Connected");
});

app.use(express.json());

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log("Connected to Server on Port", PORT);
});
