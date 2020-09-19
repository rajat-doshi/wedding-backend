module.exports.Success = (response, message) => {
  return { data: response, error: false, message: message };
};

module.exports.Error = (response, message) => {
  return { data: response, error: true, message: message, status: 200 };
};
