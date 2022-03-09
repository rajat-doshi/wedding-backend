const UserMasterModel = require("./UserMasterSchema");
const ErrorHandling = require("../../Utility/ErrorHandling/ErrorHandling");
const nodemailer = require("nodemailer");
const OtpVerify = require("../Common/Schema/otp_verify");
const Common = require("../Common/Common");
const { Op } = require('sequelize');
const multer = require('multer');
const { fileUpload } = require("../../Utility/generic");
class UserMasterModal {
  constructor() {
    this.AddUser = this.AddUser.bind(this);
    this.ForgotPassword = this.ForgotPassword.bind(this);
    this.UpdateProfilePicture = this.UpdateProfilePicture.bind(this);
  }
  async AddUser(req, response, next, { User, OtpVerify }) {
    try {
      const { email_address } = req.body;
      const userExist = await User.findOne({ where: { email_address: email_address } });
      if (!userExist) {
        const detailRow = { ...req.body, first_verify: false }
        var result = await User.create(detailRow);
        const otp = Math.floor(Math.random() * 1000000 + 1);
        const otpDetail = { otp: otp, u_id: result.dataValues.id }
        await OtpVerify.create(otpDetail)
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

  async UpdateProfilePicture(req, response, next, { User }) {
    fileUpload("profile_picture")(req, response, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log("A Multer error occurred when uploading.")
        response.json(ErrorHandling.Success(result, "A Multer error occurred when uploading."));
        return;
      } else if (err) {
        response.json(ErrorHandling.Success(result, "An unknown error occurred when uploading."));
        return;
      }
      const { token } = req.body;
      const { filename } = req.file
      try {
        const result = await User.update({ profile_picture: filename }, {
          where: { token: token }
        });
        if (result[0] === 1) {
          response.json(ErrorHandling.Success(result, "Profile picture updated"));
        }
        else {
          response.json(ErrorHandling.Error(result, "Data is not updated"));
        }
      } catch (err) {
        response.json(ErrorHandling.Error(result, "Error"));
      }
    })
  }
  async UpdateUser(req, response, next, { User }) {
    const { body } = req;
    if (Object.keys(body).length == 0) {
      this.UpdateProfilePicture(req, response, next, { User })
      return;
    }
    try {
      const { token } = body;
      let result = await User.update({ ...body }, {
        where: { token: token }
      });
      if (result[0] === 1) {
        response.json(ErrorHandling.Success(result, "User details updated"));
      }
      else {
        response.json(ErrorHandling.Error(result, "User details is not updated"));
      }
    } catch (err) {
      response.json(ErrorHandling.Error(err, "Error"));
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
  async UserExist(req, response, { User }) {
    try {
      const { email_address, password } = req
      let result = await User.findOne({
        where: {
          email_address: email_address,
          password: password,
        }
      });
      if (result) {
        const token = Common.Makeid(10);
        const userDetails = await User.update({
          token: token
        }, {
          where: {
            email_address: email_address,
            password: password,
          }
        });
        response.json(
          ErrorHandling.Success(
            { token: token },
            "Login successfully"
          )
        );
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
    } catch (err) { }
  }
  async AllUserList(req, response, next, { User }) {
    try {
      let limit = parseInt(req.query.limit);
      const { from_age, to_age, gender, religion } = req.query;
      let condition = {};
      let skip =
        parseInt(req.query.page) != 1
          ? parseInt(req.query.page) * parseInt(req.query.limit) - 1
          : 0;
      if (from_age) {
        condition = { age: { [Op.gt]: from_age } };
      }
      if (to_age) {
        condition = {
          age: {
            ...condition.age,
            [Op.lt]: to_age
          }
        };
      }
      if (gender) {
        condition = { ...condition, gender: gender }
      }
      if (religion) {
        condition = { ...condition, religion: religion }
      }
      let result = await User.findAll({
        attributes: [
          'id',
          'first_name',
          'last_name',
          'age',
          'religion',
          'email_address',
          'city',
          'state',
          'profile_picture'
        ],
        where: { ...condition },
        limit: limit,
        offset: skip ? skip : 0
      });
      let finalResponse = {
        records: result,
        total_record: limit,
        page: req.query.page,
      };
      response.json(ErrorHandling.Success(finalResponse, "All user list"));
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async GetUserDetail(req, response, next, { User }) {
    try {
      let result = await User.findOne({ where: req });
      if (result) {
        response.json(ErrorHandling.Success(result, "User detail"));
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
        pass: "Rosy@1234", // generated ethereal password
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
  async OtpVerify(condition, response, { User, OtpVerify }) {
    try {
      let userExist = await User.findOne({
        where: { email_address: condition.email_address }
      });
      if (!userExist) {
        response.json(
          ErrorHandling.Error(
            userExist,
            "Email address is not associated with us"
          )
        );
      }
      let resultOtp = await OtpVerify.findOne({
        where: {
          otp: condition.otp,
          u_id: userExist.id
        }
      });
      if (resultOtp) {
        let result = await User.update({ first_verify: true }, {
          where: {
            id: resultOtp.u_id
          }
        });
        response.json(
          ErrorHandling.Success(userExist, "Otp verify successfully")
        );
      } else {
        response.json(ErrorHandling.Error(resultOtp, "Entred otp is wrong"));
      }
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async ForgotPassword(req, response, next, { User, OtpVerify }) {
    try {
      const { email_address } = req;
      let userExist = await User.findOne({
        where: { email_address: email_address }
      });
      if (!userExist) {
        response.json(
          ErrorHandling.Error(
            userExist,
            "Email address is not associated with us"
          )
        );
      } else {
        let otp = Math.floor(Math.random() * 1000000 + 1);
        let otpVerifyResult = await OtpVerify.update({
          otp: otp
        }, { where: { u_id: userExist.id } });
        this.VerifyEmail(otp, email_address);
        response.json(
          ErrorHandling.Success(
            otpVerifyResult,
            "Otp is successfully sent on registred email address"
          )
        );
      }
    } catch (err) {
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
  async ChangePassword(req, response, next, { User }) {
    try {
      const { password } = req;
      let verifyToken = await User.findOne(
        {
          where: {
            token: req.token
          }
        });
      if (verifyToken) {
        let result = await User.update(
          { password: password },
          { where: { token: req.token } }
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

  async UserCount(response, { User }) {
    try {
      const allUserCount = await User.count();
      const maleUserCount = await User.count({
        where: { 'gender': "Male" }
      });
      const femaleUserCount = await User.count({
        where: { 'gender': "Female" }
      });
      response.json(ErrorHandling.Success({
        all_user_count: allUserCount,
        male_user_count: maleUserCount,
        female_user_count: femaleUserCount,
      }, "All user count"));
    } catch (err) {
      console.log(err)
      response.json(
        ErrorHandling.Error(err, "There are some technical issue.")
      );
    }
  }
}
module.exports = new UserMasterModal();
