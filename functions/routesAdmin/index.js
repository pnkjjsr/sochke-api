// User API
const { login } = require("./users");

// Pages API
const { dashboard } = require("./pages/dashboard");

// Contribute API
const { contributePublic } = require("./contributionPublic");
const { contributePublicAll } = require("./contributionPublic");
const { contributePublicAdd } = require("./contributionPublic");
const { contributePublicUpdate } = require("./contributionPublic");

module.exports = {
  login,
  dashboard,
  contributePublic,
  contributePublicAll,
  contributePublicAdd,
  contributePublicUpdate
};
