const ChildProcess = require("child_process");
const MinisterCron = ChildProcess.fork("./childProcess/minister.js");
const PollCron = ChildProcess.fork("./childProcess/poll.js");
const ConstituencyCron = ChildProcess.fork("./childProcess/constituency.js");

exports.cronMinister = (req, res) => {
  const data = {
    sheetType: req.body.sheetType,
    sheetRange: req.body.sheetRange
  };

  MinisterCron.send(data);

  return res.status(200).send({
    code: "cron/running",
    message: "Cron run successfully."
  });
};

exports.cronPolls = (req, res) => {
  const data = {
    sheetType: req.body.sheetType,
    sheetRange: req.body.sheetRange
  };

  PollCron.send(data);

  return res.status(200).send({
    code: "cron/running",
    message: "Cron run successfully."
  });
};

exports.cronConstituencies = (req, res) => {
  const data = {
    sheetType: req.body.sheetType,
    sheetRange: req.body.sheetRange
  };

  ConstituencyCron.send(data);

  return res.status(200).send({
    code: "cron/running",
    message: "Cron run successfully."
  });
};
