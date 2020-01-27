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

exports.cronAddMinisterPhoto = (req, res) => {
  const { db } = require("../../utils/admin");

  let colRef = db.collection("ministers");
  colRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let mData = doc.data();
        let data = {
          photoUrl: `https://firebasestorage.googleapis.com/v0/b/sochke-dev.appspot.com/o/images%2Fministers%2F${mData.name}.gif?alt=media`
        };

        colRef
          .doc(mData.id)
          .update(data)
          .then(() => {
            console.log(`${mData.name}, photoUrl updated on DB.`);
          })
          .catch(err => {
            console.log(err);
          });
      });

      console.log("Cron Completed");
    })
    .catch(err => {
      console.log(err);
    });

  return res.status(200).send({
    code: "ministers/updating",
    message: "Minister update cron running successfully."
  });
};

exports.cronUpdateUserSearchTag = (req, res) => {
  const { db } = require("../../utils/admin");
  const { createTagArr } = require("./utils");

  let colRef = db.collection("users");

  colRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let uData = doc.data();
        let words = uData.displayName;
        let wordArr = createTagArr(words);

        let len = wordArr[0].length;

        if (!len) return;
        colRef
          .doc(uData.id)
          .update({ searchTags: wordArr })
          .then(() => {
            console.log(`${uData.displayName}, updated.`);
          });
      });

      res.json({
        code: "user/updating",
        message: "User search tags updating."
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

exports.cronUpdateMinisterSearchTag = (req, res) => {
  const { db } = require("../../utils/admin");
  const { createTagArr } = require("./utils");

  let colRef = db.collection("ministers");

  colRef
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let mData = doc.data();
        let words = mData.name;
        let wordArr = createTagArr(words);

        let len = wordArr[0].length;

        if (!len) return;

        colRef
          .doc(mData.id)
          .update({ searchTags: wordArr })
          .then(() => {
            console.log(`${mData.name}, updated.`);
          });
      });

      res.json({
        code: "minister/updating",
        message: "minister search tags updating."
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};
