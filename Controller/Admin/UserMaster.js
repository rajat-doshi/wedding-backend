const UserMasterModal = require("../../Modal/Admin/UserMaster/UserMasterModal");
class UsermasterAdmin {
  constructor() {}
  GetAllUser(req, res, next) {
    UserMasterModal.GetAllUser(req, res, next);
  }
}

module.exports = new UsermasterAdmin();
