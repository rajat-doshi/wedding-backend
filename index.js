const express = require("express");
const app = express();
const path = require("path");
var fileUpload = require("express-fileupload");
app.use(fileUpload());
var cors = require("cors");
app.use(cors());

const formData = require("express-form-data");
const os = require("os");
const port = 3001;
var multer = require("multer");
var upload = multer();
var bodyParser = require("body-parser");
// const options = {
//     uploadDir: os.tmpdir(),
//     autoClean: true
//   };
// app.use(formData.parse(options));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// for parsing multipart/form-data
//app.use(upload.array());
require("./Routes/index")(app);
require("./Config/Database");

app.use(function (err, req, res, next) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/file", function (req, res) {
  res.sendFile(__dirname + req.query.file);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
