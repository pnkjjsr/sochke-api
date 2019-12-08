// Get all respond
exports.getPoll = (req, res) => {
  const data = {
    type: req.body.type
  };

  res.json(data);
};
