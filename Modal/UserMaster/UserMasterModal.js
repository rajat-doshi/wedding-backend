const UserMasterModel = require("./UserMasterSchema");
const ErrorHandling = require("../../Utility/ErrorHandling/ErrorHandling");
const nodemailer = require("nodemailer");
const OtpVerify = require("../Common/Schema/otp_verify");
const Common = require("../Common/Common");
class UserMasterModal {
  constructor() {
    this.AddUser = this.AddUser.bind(this);
    this.ForgotPassword = this.ForgotPassword.bind(this);
  }
  async AddUser(req, response, next) {
    try {
      let userExist = await UserMasterModel.find({
        email_address: req.body.email_address,
      });

      if (userExist.length == 0) {
        var result = await UserMasterModel(req.body).save();
        let otp = Math.floor(Math.random() * 1000000 + 1);
        let otpVerifyResult = await OtpVerify({
          registred_user_id: result._id,
          otp: otp,
          first_verify: false,
        }).save();

        if (this.VerifyEmail(otp, result.email_address)) {
          response.json(ErrorHandling.Success(result, "Mail sent"));
        } else {
          response.json(ErrorHandling.Success(result, "Data inserted"));
        }
      } else {
        response.json(
          ErrorHandling.Error(
            userExist,
            "Email address already associated with us"
          )
        );
      }
    } catch (err) {
      response.json(ErrorHandling.Error(err, "Error1"));
    }
  }
  async UpdateUser(condition, request, response) {
    try {
      let result = await UserMasterModel(condition).updateOne(request);
      response.json(ErrorHandling.Success(result, "Data updated"));
    } catch (err) {
      response.json(ErrorHandling.Error(err, "Error"));
    }
  }
  async ProfilePhotoUpload(file, filePath) {
    try {
      let result = await file.mv(`${filePath}`);
      return true;
    } catch (err) {
      return false;
    }
  }
  async DeleteUser(record) {
    try {
      let result = await UserMasterModel.findOneAndDelete(record);
      return true;
    } catch (error) {
      return err;
    }
  }
  async UserExist(req, response) {
    try {
      let result = await UserMasterModel.find(req);
      if (result.length > 0) {
        response.json(ErrorHandling.Success(result[0], "Login successfully"));
      } else {
        response.json(
          ErrorHandling.Error(
            result,
            "You have Entred wrong email or password "
          )
        );
      }
      return result;
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async UserUpdate(req, response) {
    try {
    } catch (err) {}
  }
  async AllUserList(req, response) {
    try {
      let limit = parseInt(req.query.limit);
      let skip =
        parseInt(req.query.page) != 1
          ? parseInt(req.query.page) * parseInt(req.query.limit)-1
          : 0;
      let result = await UserMasterModel.find({}).limit(limit).skip(skip);
      let finalResponse = {
        records: result,
        total_record: await UserMasterModel.countDocuments(),
        page: req.query.page,
      };

      response.json(ErrorHandling.Success(finalResponse, "All user list"));
    } catch (err) {
      console.log(err);
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async GetUserDetail(req, response) {
    try {
      let result = await UserMasterModel.find(req);
      if (result.length > 0) {
        response.json(ErrorHandling.Success(result[0], "User detail"));
      } else {
        response.json(ErrorHandling.Error(result, "User not exist!"));
      }
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async VerifyEmail(otp, recipent) {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "rajatdoshi11@outlook.com", // generated ethereal user
        pass: "Anamikarajat@123", // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: '"Rajat Doshi 👻" <rajatdoshi11@outlook.com>', // sender address
      to: `${recipent}`, // list of receivers
      subject: "Verify your email", // Subject line
      text: "Your otp", // plain text body
      html: `<b>Your otp ${otp}</b>`, // html body
    });
    if (info.messageId) {
      return true;
    } else {
      return false;
    }
  }
  async OtpVerify(condition, response, next) {
    try {
      let userExist = await UserMasterModel.find({
        email_address: condition.email_address,
      });
      if (userExist.length == 0) {
        response.json(
          ErrorHandling.Error(
            userExist,
            "Email address is not associated with us"
          )
        );
        return;
      }

      let result = await OtpVerify.find({
        otp: condition.otp,
        registred_user_id: userExist[0]._id,
      });
      if (result.length > 0) {
        let token = Common.Makeid(10);
        let result = await UserMasterModel.update(
          {
            email_address: condition.email_address,
          },
          { $set: { verify: true, token: token } }
        );
        response.json(
          ErrorHandling.Success({ token }, "Otp verify successfully")
        );
      } else {
        response.json(ErrorHandling.Error(result, "Entred otp is wrong"));
      }
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async ForgotPassword(req, response, next) {
    try {
      let userExist = await UserMasterModel.find({
        email_address: req.body.email_address,
      });

      if (userExist.length == 0) {
        response.json(
          ErrorHandling.Error(
            userExist,
            "Email address is not associated with us"
          )
        );
      } else {
        let otp = Math.floor(Math.random() * 1000000 + 1);

        let otpVerifyResult = await OtpVerify.update(
          {
            registred_user_id: userExist[0]._id,
          },
          { $set: { otp: otp } }
        );
        response.json(
          ErrorHandling.Success(
            otpVerifyResult,
            "Otp is successfully sent on registred email address"
          )
        );

        this.VerifyEmail(otp, req.body.email_address);
      }
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async ChangePassword(req, response, next) {
    try {
      let verifyToken = await UserMasterModel.find({ token: req.body.token });

      if (verifyToken.length > 0) {
        let result = await UserMasterModel.update(
          { token: req.body.token },
          { $set: { password: req.body.password } }
        );
        response.json(ErrorHandling.Success(result, "Password change"));
      } else {
        response.json(ErrorHandling.Success({}, "User is not authorised"));
      }
    } catch (err) {
      response.json(
        ErrorHandling.Success(
          err,
          "There are some technical issue please try again!"
        )
      );
    }
  }
}
module.exports = new UserMasterModal();
