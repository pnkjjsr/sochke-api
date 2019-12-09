// Get all respond
exports.test = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString()
  };
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  res.json(token);
};
