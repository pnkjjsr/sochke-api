const ChildProcess = require("child_process");
const MinisterCron = ChildProcess.fork("./childProcess/minister.js");
const PollCron = ChildProcess.fork("./childProcess/poll.js");

exports.cronMinister = (req, res) => {
  const type = req.body.type;
  MinisterCron.send(type);
  return res.json("Cron run successfully.");
};

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

exports.cronPolls = (req, res) => {
  const type = req.body.type;
  PollCron.send(type);
  return res.status(200).send({
    status: "done",
    code: "cron/running",
    message: "Cron run successfully."
  });
};
