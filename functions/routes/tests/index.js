// Get all respond
exports.test = (req, res) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  res.json(token);
};
