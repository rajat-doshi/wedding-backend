const { Sequelize, DataTypes } = require('sequelize');
const os = require("os");
console.log(os.hostname())
let DATABASE_NAME="wedding-db";
let USER_NAME = "admin";
let PASSWORD = "Tajmahal123"
let HOST_NAME="wedding-db.ccjtmcaqpmx1.ap-south-1.rds.amazonaws.com";
if(os.hostname()==="DESKTOP-F8VHQA4"){
  DATABASE_NAME="wedding1";
  USER_NAME="root";
  PASSWORD="123456";
  HOST_NAME="localhost";
}
const mysql= new Sequelize(DATABASE_NAME,USER_NAME,PASSWORD,{
  host: HOST_NAME,
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
  },
  father_income:{
    type: DataTypes.STRING,
  },
  mother_name:{
    type: DataTypes.STRING,
  },
  mother_occuption:{
    type: DataTypes.STRING,
  },
  mother_income:{
    type: DataTypes.INTEGER,
  },
  mother_job_profile:{
    type: DataTypes.STRING,
  },
  married_brother:{
    type:DataTypes.INTEGER
  },
  unmarried_brother:{
    type:DataTypes.INTEGER
  },
  married_sister:{
    type:DataTypes.INTEGER
  },
  unmarried_sister:{
    type:DataTypes.INTEGER
  },
  birth_date:{
    type:DataTypes.DATE
  },
  profile_picture:{
    type:DataTypes.STRING                                      
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
