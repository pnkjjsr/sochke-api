// User API
const { login } = require("./users");

// Pages API
const { dashboard } = require("./pages/dashboard");

module.exports = {
  login,

  dashboard
};
