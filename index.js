const express = require("express");
const app = express();
const path = require("path");
const Sequelize = require('sequelize');

// var fileUpload = require("express-fileupload");
// app.use(fileUpload());
var cors = require("cors");
app.use(cors());
const formData = require("express-form-data");
const os = require("os");
const port = 3001;
var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require("./Routes/index")(app);
app.use(function (err, req, res, next) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});

app.get("/", (req, res) => res.send("Hello World!"));
app.post("/file", function (req, res) {
  console.log(req.file)
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
