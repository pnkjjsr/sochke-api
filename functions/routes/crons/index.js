const ChildProcess = require("child_process");
const MinisterCron = ChildProcess.fork("./childProcess/minister.js");

exports.cronCouncillors = (req, res) => {
  const type = req.body.type;
  MinisterCron.send(type);
  return res.json("Cron run successfully.");
};
exports.cronMlas = (req, res) => {
  const type = req.body.type;
  MinisterCron.send(type);
  return res.json("Cron run successfully.");
};
exports.cronMps = (req, res) => {
  const type = req.body.type;
  MinisterCron.send(type);
  return res.json("Cron run successfully.");
};
