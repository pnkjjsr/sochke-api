// User API
const { login } = require("./users");

// Pages API
const { dashboard } = require("./pages/dashboard");

// Contribute API
const { addContributePublic } = require("./contributionPublic");

module.exports = {
  login,
  dashboard,
  addContributePublic
};
