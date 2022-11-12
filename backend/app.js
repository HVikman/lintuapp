const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const havainnotRoutes = require("./routes/havainnot");
const authRoutes = require("./routes/auth");

const app = express();

mongoose
  .connect(
    "mongodb+srv://henri:" +
      process.env.DB_Pw +
      "@cluster0.7hwoqf6.mongodb.net/lintuapp?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("error connecting to database");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "lintu")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/havainnot", havainnotRoutes);
app.use("/api/auth", authRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "lintu", "index.html"));
});

module.exports = app;
