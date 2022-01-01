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
  }
});

exports.OtpVerify = mysql.define('otp_verify', {
 otp:{
   type:DataTypes.STRING
 },
 u_id:{
   type:DataTypes.STRING
  }
})
