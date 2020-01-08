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
    state: req.body.state
  };

  let pollData = [];
  let userQuery = db.collection("users").doc(data.uid);
  let transaction = db
    .runTransaction(t => {
      return t.get(userQuery).then(doc => {
        let uData = doc.data();

        let allPoll = db
          .collection("polls")
          .where("state", "==", uData.state)
          .orderBy("createdAt", "desc")
          .limit(100)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let pollData = doc.data();
              db.collection("polls")
                .doc(pollData.id)
                .collection("pollVotes")
                .doc(uData.id)
                .get()
                .then(doc => {
                  if (!doc.exists) {
                    pollData.push(pollData);
                  }
                });
            });
          })
          .catch(err => {
            console.log(err);
          });

        return Promise.all([allPoll]).catch(err => {
          console.log(err);
        });
      });
    })
    .then(() => {
      res.status(200).json(pollData);
    })
    .catch(err => {
      res.status(404).json(err);
    });
};
