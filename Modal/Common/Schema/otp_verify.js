var mongoose = require("mongoose");
var nameSchema = new mongoose.Schema({
  registred_user_id: String,
  otp: String,
  first_verify: Boolean,
});
module.exports = mongoose.model("otp_verifies", nameSchema);
