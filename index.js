const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors());
const formData = require("express-form-data");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
require("./Routes/index")(app);
app.use(function (err, req, res, next) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});
const port = process.env.PORT || 3001;
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
