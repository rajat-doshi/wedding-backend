const UserMaster = require("../Controller/UserMaster");

var multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+".jpg")
  }
})
//var upload = multer({dest: 'Uploads/' })
const upload = multer({ storage: storage })

module.exports = (app) => {
  app.post("/add-user", UserMaster.AddUser);
  app.post("/login", UserMaster.Login);
  app.post(`/user-update`,upload.single('image'),UserMaster.UpdateUser);
  app.get(`/user-list`, UserMaster.AllUserList);
  app.post(`/get-user-detail-by-id`, UserMaster.GetUserDetail);
  app.post(`/profile-photo-upload`, UserMaster.ProfilePhotoUpload);
  app.post(`/register-user-verification`, UserMaster.OtpVerify);
  app.post(`/forgot-password`, UserMaster.ForgotPassword);
  app.post(`/change-password`, UserMaster.ChangePassword);
};
