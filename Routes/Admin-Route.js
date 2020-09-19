const UserMaster = require("../Controller/Admin/UserMaster");
module.exports = (app) => {
  app.post("/admin/user/get-all-user", UserMaster.GetAllUser);
};
