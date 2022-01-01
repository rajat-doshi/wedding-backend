const UserMasterModel = require("./UserMasterSchema");
const ErrorHandling = require("../../Utility/ErrorHandling/ErrorHandling");
const nodemailer = require("nodemailer");
const OtpVerify = require("../Common/Schema/otp_verify");
const Common = require("../Common/Common");
const moment =require("moment");
const { Op } = require('sequelize');
const { json } = require("body-parser");
class UserMasterModal {
  constructor() {
    this.AddUser = this.AddUser.bind(this);
    this.ForgotPassword = this.ForgotPassword.bind(this);
  }
  async AddUser(req, response, next, {User,OtpVerify}) {
    try {
      const {email_address} = req.body;
      const userExist= await User.findOne({ where: { email_address: email_address } });
      if (!userExist) {
        const detailRow = {...req.body,first_verify:false}
        var result = await User.create(detailRow);
        const otp = Math.floor(Math.random() * 1000000 + 1);
        const otpDetail = {otp:otp,u_id:result.dataValues.id}
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
  async UpdateUser(req,response, next,{User}) {
    try {
      const {token} = req;
      console.log(req)
      response.json(json.toString(req.files))
      let result = await User.update({...req},{
        where:{token:token}
      });
      if(result[0]===1)
      {
        response.json(ErrorHandling.Success(result, "Data updated"));
      }
      else{
        response.json(ErrorHandling.Error(result, "Data is not updated"));
      }
     
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
  async UserExist(req, response,{User}) {
    try {
      const {email_address, password} = req  
      let result = await User.findOne({
        where:{
          email_address: email_address,
          password:password,
        }
      });
      if (result) {
        const token = Common.Makeid(10);
        const userDetails = await User.update({
          token:token
        },{
          where:{
            email_address: email_address,
            password:password,
          }
        });
        response.json(
          ErrorHandling.Success(
            {token:token},
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
    } catch (err) {}
  }
  async AllUserList(req, response,next,{User}) {
    try {
      let limit = parseInt(req.query.limit);
      console.log(req.query)
      const {from_age,to_age,gender,religion} = req.query;
      let condition={};
      let skip =
        parseInt(req.query.page) != 1
          ? parseInt(req.query.page) * parseInt(req.query.limit)-1
          : 0;
       if(from_age)
       {
        condition={age:{[Op.gt]:from_age}};
       }
       if(to_age)
       {
        condition={age:{
          ...condition.age,
          [Op.lt]:to_age}
        };
       }
       if(gender)
       {
         
         condition = {...condition,gender:gender}
       }
       if(religion)
       {
        condition={...condition,religion:religion}
       }
      let result = await User.findAll({ 
        attributes: [
          'id',
          'first_name',
          'last_name',
          'age',
          'religion',
          'email_address'
        ],
        where: {...condition},
         limit: limit,
         offset:skip?skip:0
         });
      let finalResponse = {
        records: result,
        total_record: limit,
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
  async GetUserDetail(req, response,next,{User}) {
    try {
      let result = await User.findOne({ where: req });
      if (result) {
        response.json(ErrorHandling.Success(result, "User detail"));
      } else {
        response.json(ErrorHandling.Error(result, "User not exist!"));
      }
    } catch (err) {
      console.log(err)
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
        pass: "PappuPassHoGaya", // generated ethereal password
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
  async OtpVerify(condition, response,{User,OtpVerify}) {
    try {
      let userExist = await User.findOne({
       where:{ email_address: condition.email_address}
      });
      if (!userExist) {
        response.json(
          ErrorHandling.Error(
            userExist,
            "Email address is not associated with us"
          )
        );
        return;
      }

      let resultOtp = await OtpVerify.findOne({
       where:{
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
          ErrorHandling.Success({result }, "Otp verify successfully")
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
