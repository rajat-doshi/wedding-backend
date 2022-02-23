const { Sequelize, DataTypes } = require('sequelize');
const mysql= new Sequelize("wedding1", "root", "123456",{
  host: 'localhost',
  dialect:"mysql"
});
exports.User = mysql.define('user_masters', {
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING
  },
  age:{
    type:DataTypes.INTEGER
  },
  gender:{
    type:DataTypes.STRING
  },
  religion:{
    type:DataTypes.STRING
  },
  email_address: {
    type: DataTypes.STRING
  },
  mobile_number: {
    type: DataTypes.STRING
  },
  height:{
    type: DataTypes.STRING
  },
  weight:{
    type: DataTypes.STRING
  },
  zipcode:{
    type: DataTypes.INTEGER
  },
  city:{
    type: DataTypes.STRING
  },
  state:{
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  first_verify:{
    type:DataTypes.BOOLEAN
  },
  token: {
    type: DataTypes.STRING,
  },
  religion: {
    type: DataTypes.STRING,
  },
  occuption: {
    type: DataTypes.STRING,
  },
  job_profile:{
    type: DataTypes.STRING,
  },
  income:{
    type: DataTypes.STRING,
  },
  father_name:{
    type: DataTypes.STRING,
  },
  father_occuption:{
    type: DataTypes.STRING,
  },
  father_job_profile:{
    type: DataTypes.STRING,
  }
});

exports.OtpVerify = mysql.define('otp_verifies', {
 otp:{
   type:DataTypes.STRING
 },
 u_id:{
   type:DataTypes.STRING
  }
})
