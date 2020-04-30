// Contribution Public
const { voteContributionPublic } = require("./contributionPublic");
const { userCounterAdd } = require("./users");
const { covidUserAdd } = require("./covid");
const { covidLocationAdd } = require("./covid");
const { subscriberAdd } = require("./subscribers");

module.exports = {
  voteContributionPublic,
  userCounterAdd,
  covidUserAdd,
  covidLocationAdd,
  subscriberAdd,
};
