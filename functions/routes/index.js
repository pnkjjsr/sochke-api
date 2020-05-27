// Contribution Public
const { voteContributionPublic } = require("./contributionPublic");
const { userCounterAdd } = require("./users");
// Covid Map
const { covidUserAdd } = require("./covid");
const { covidLocationAdd } = require("./covid");
// Subscribers
const { subscriberAdd } = require("./subscribers");
// Open Neta
const { getNeta } = require("./ministers");
const { postNeta } = require("./ministers");
const { postNetaLike } = require("./ministers");

module.exports = {
  voteContributionPublic,
  userCounterAdd,
  covidUserAdd,
  covidLocationAdd,
  subscriberAdd,
  getNeta,
  postNeta,
  postNetaLike,
};
