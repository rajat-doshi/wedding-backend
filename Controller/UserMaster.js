const UserMasterModal = require("../Modal/UserMaster/UserMasterModal");
const ErrorHandling = require("../Utility/ErrorHandling/ErrorHandling");
const { User, OtpVerify } = require("../Config/Database")
class UserMaster {
  constructor() {
    this.AddUser = this.AddUser.bind(this);
  }

  async AddUser(req, res, next) {
    User.sync();
    OtpVerify.sync();
    UserMasterModal.AddUser(req, res, next, { User, OtpVerify });
  }
  OtpVerify(req, res, next) {
    User.sync();
    OtpVerify.sync();
    UserMasterModal.OtpVerify(req.body, res, { User, OtpVerify });
  }
  Login(req, res, next) {
    UserMasterModal.UserExist(req.body, res, { User });
  }
  UpdateUser(req, res, next) {
    UserMasterModal.UpdateUser(req, res, next, { User });
  }
  AllUserList(req, res, next) {
    let result = UserMasterModal.AllUserList(req, res, next, { User });
  }
  GetUserDetail(req, res, next) {
    UserMasterModal.GetUserDetail(req.body, res, next, { User });
  }
  ProfilePhotoUpload(req, res, next) {
    let FilePath = `Uploads/${Math.random() * 10000000000000}${req.files.profile_picture.name
      }`;
    let result = UserMasterModal.ProfilePhotoUpload(
      req.files.profile_picture,
      FilePath
    );
    result.then((resResult) => {
      if (resResult) {
        try {
          UserMasterModal.UpdateUser(
            { _id: req.body._id },
            { profile_picture: FilePath },
            res
          );
        } catch (err) {
          res.json(ErrorHandling.Error(err, "Error"));
        }
      } else {
        res.json(ErrorHandling.Error(result, "Error"));
      }
    });
  }
  ForgotPassword(req, res, next) {
    UserMasterModal.ForgotPassword(req.body, res, next,{User, OtpVerify});
  }
  ChangePassword(req, res, next) {
    UserMasterModal.ChangePassword(req.body, res, next, {User})
  }
}
module.exports = new UserMaster();
