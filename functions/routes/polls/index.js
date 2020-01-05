// Submit user Poll
exports.postPoll = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAd: new Date().toISOString(),
    uid: req.body.uid,
    pid: req.body.pid,
    vote: req.body.vote
  };

  let colRef = db.collection("polls").doc(data.pid);

  let transaction = db
    .runTransaction(t => {
      return t.get(colRef).then(doc => {
        let pollData = doc.data();

        let updateCount = {};
        if (data.vote) {
          updateCount = {
            voteTrueCount: pollData.voteTrueCount + 1
          };
        } else {
          updateCount = {
            voteFalseCount: pollData.voteFalseCount + 1
          };
        }
        colRef.update(updateCount);

        let voteData = {
          createdAt: new Date().toISOString(),
          id: data.uid,
          pid: data.pid
        };
        let voted = db
          .collection("polls")
          .doc(data.pid)
          .collection("pollVotes")
          .doc(data.uid)
          .set(voteData)
          .then(() => {
            console.log(`${data.uid} vote saved`);
          });
      });
    })
    .then(() => {
      return res.json({
        code: "poll/add",
        status: "done",
        message: "Poll answer added."
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
};

// Get Poll 1 by 1 with check if already Polled
exports.getPoll = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    type: req.body.type
  };

  let colRef = db.collection("polls");
  let query = colRef.where("type", "==", data.type);

  query
    .get()
    .then(async snapshot => {
      if (snapshot.empty) {
        return res.json({
          code: "poll/empty",
          status: "done",
          message: "No poll available in this constituency."
        });
      }

      await snapshot.forEach(doc => {
        let pData = doc.data();
        let pid = pData.id;
        let colRef = db.collection("pollVotes");
        let query = colRef.where("uid", "==", data.uid).where("pid", "==", pid);

        query.get().then(snapshot => {
          if (snapshot.empty) {
            return res.json(pData);
          }

          return res.json({
            code: "poll/all-done",
            status: "done",
            message: "No new poll remaining."
          });
        });
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
