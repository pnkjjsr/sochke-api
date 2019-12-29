exports.contribution = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    constituency: req.body.constituency,
    district: req.body.district
  };

  let colRef = db.collection("contributions");
  let queryRef = colRef
    .where("constituency", "==", data.constituency)
    .limit(25);
  let contData = {
    contributions: [],
    contributionVoted: []
  };
  let checkVoted = [];
  let transaction = db.runTransaction(t => {
    return t
      .get(queryRef)
      .then(snapshot => {
        if (snapshot.empty) {
          return res.status(204).json({
            status: "done",
            code: "contribution/empty",
            message: "contribution not written in this constituency"
          });
        }

        snapshot.forEach(doc => {
          let cData = doc.data();
          contData.contributions.push(cData);
          checkVoted.push(cData.id);
        });

        let checkVoteRef = checkVoted.map(contId => {
          db.collection("contributionVotes")
            .where("uid", "==", data.uid)
            .where("cid", "==", contId)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                contData.contributionVoted.push(doc.data());
                console.log(contData.contributionVoted);
              });
            });
        });

        return Promise.all([checkVoteRef]);
      })
      .then(() => {
        console.log(contData.contributionVoted);

        return res.status(200).json(contData);
      })
      .catch(err => {
        return res.status(404).json(err);
      });
  });
};

exports.addContribution = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: req.body.createdAt,
    uid: req.body.uid,
    constituency: req.body.constituency,
    district: req.body.district,
    state: req.body.state,
    title: req.body.title,
    description: req.body.description,
    imgUrl: req.body.imgUrl,
    voteTrueCount: 0,
    voteFalseCount: 0,
    opinionCount: 0
  };

  let colRef = db.collection("contributions");
  let docRef = colRef.doc();
  data.id = docRef.id;

  colRef
    .doc(data.id)
    .set(data)
    .then(() => {
      return res.status(201).json({
        status: "done",
        code: "contribution/added",
        message: "Contribution added."
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};

exports.voteContribution = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    createdAt: req.body.createdAt,
    uid: req.body.uid,
    cid: req.body.cid,
    vote: req.body.vote
  };

  let colRef = db.collection("contributionVotes");
  let queryRef = colRef
    .where("uid", "==", data.uid)
    .where("cid", "==", data.cid);

  let transaction = db.runTransaction(t => {
    return t
      .get(queryRef)
      .then(snapshot => {
        if (snapshot.empty) {
          let docRef = colRef.doc();
          data.id = docRef.id;
          docRef
            .set(data)
            .then(() => {
              return res.status(201).json({
                code: "contribution/voted",
                message: "vote added on that contribution."
              });
            })
            .catch(err => {
              return res.status(404).json(err);
            });
        } else {
          return res.status(208).json({
            code: "contribution/already-voted",
            message: "This user already voted on this contribution."
          });
        }

        let getContribute = db
          .collection("contributions")
          .doc(data.cid)
          .get()
          .then(doc => {
            let trueCount = doc.data().voteTrueCount;
            let falseCount = doc.data().voteFalseCount;
            updateContribution(trueCount, falseCount);
          })
          .catch(err => {
            return res.status(404).json(err);
          });

        let contributionRef = db.collection("contributions").doc(data.cid);
        let updateContribution = (t, f) => {
          if (data.vote) {
            contributionRef.update({
              voteTrueCount: t + 1
            });
          } else {
            contributionRef.update({
              voteFalseCount: f + 1
            });
          }
        };

        return Promise.all([getContribute]);
      })
      .catch(err => {
        return res.status(404).json(err);
      });
  });
};
