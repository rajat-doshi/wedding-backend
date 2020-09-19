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

  Makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
module.exports = new Common();
