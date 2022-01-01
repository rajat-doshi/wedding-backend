class Common {
  FileUpload(file, path) {
    path = path + file.name;

    file.mv(path, function (err, result) {
      if (err) {
        throw err;
      }
      if (result) {
        console.log(result);
      }
    });
  }

  Makeid() {
  return Math.random(10).toString(36).substr(2); 
  }
}
module.exports = new Common();
