var mongoose = require("mongoose");
  //Import the mongoose module
  //Set up default mongoose connection
  
  var mongoDB =
    "mongodb+srv://rajat:Bacancy@123@cluster0-9jwjh.mongodb.net/wedding?retryWrites=true&w=majority";
    module.exports = mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("DB connnection successful!"))
    .catch(() => console.error.bind(console, "MongoDB connection error:"));
