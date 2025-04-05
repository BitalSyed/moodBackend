const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors=require('cors')
require('dotenv').config();

// Bypass Cross Origin Blocking
app.use(cors())

// Server Port
const port = 4000;
// Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Your MongoDB URI
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  // Main Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));

app.get('/', (req, res)=>{
  res.status(200).json({message: "API is Live"})
})

// listing of the server or server settings
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
