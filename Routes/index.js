const UserMaster = require("../Controller/UserMaster");
module.exports = (app) => {
  app.post("/add-user", UserMaster.AddUser);
  app.post("/login", UserMaster.Login);
  app.post(`/user-update`,UserMaster.UpdateUser);
  app.get(`/user-list`, UserMaster.AllUserList);
  app.post(`/get-user-detail-by-id`, UserMaster.GetUserDetail);
  app.post(`/profile-photo-upload`, UserMaster.ProfilePhotoUpload);
  app.post(`/register-user-verification`, UserMaster.OtpVerify);
  app.post(`/forgot-password`, UserMaster.ForgotPassword);
  app.post(`/change-password`, UserMaster.ChangePassword);
};
