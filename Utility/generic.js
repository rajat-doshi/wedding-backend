const multer  = require('multer');
module.exports.fileUpload=(fileName)=>{
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
               
          cb(null, `${Math.floor(Date.now() / 1000)}_${file.originalname}`)
        }
      })
      
      let upload = multer({ storage: storage })
      return upload.single(fileName)
}
