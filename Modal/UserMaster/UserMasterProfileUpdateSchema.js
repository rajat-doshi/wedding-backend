var mongoose = require("mongoose");
var nameSchema = new mongoose.Schema({
  fisrt_name: String,
  last_name: String,
  mobile_number: String,
  address: String,
  email_address: String,
  password:String,
  height:String,
  weight:String,
  occuption:String,
  income:String
});
module.exports = mongoose.model("user_master1", nameSchema);
