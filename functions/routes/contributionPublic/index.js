exports.contribution = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    constituency: req.body.constituency,
    pincode: req.body.pincode,
    state: req.body.state
  };

  let contributionRef = db
    .collection("contributions")
    // .where("constituency", "==", data.constituency)
    .where("state", "==", data.state)
    .orderBy("createdAt", "desc")
    .limit(50);

  let emptyData = "";
  let contData = {
    contributions: []
  };

  let transaction = db.runTransaction(t => {
    return t
      .get(contributionRef)
      .then(snapshot => {
        if (snapshot.empty) {
          return (emptyData = "empty");
        }
        let count = snapshot.size;
        let countCheck = 0;

        return new Promise((resolve, reject) => {
          snapshot.forEach(doc => {
            let cData = doc.data();

            db.collection("contributions")
              .doc(cData.id)
              .collection("contributionVotes")
              .doc(data.uid)
              .get()
              .then(doc => {
                if (!doc.exists) contData.contributions.push(cData);

                countCheck++;
                if (count == countCheck) resolve();
              });
          });
        });
      })
      .then(() => {
        if (emptyData == "empty") {
          return res.status(200).json({
            code: "contribution/empty",
            message: "contribution not written in this constituency"
          });
        }

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

exports.voteContributionPublic = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    createdAt: req.body.createdAt,
    userIP: req.body.userIP,
    cpid: req.body.cpid,
    vote: req.body.vote
  };

  let colRef = db.collection("contributionPublic").doc(data.cpid);

  let transaction = db
    .runTransaction(t => {
      return t.get(colRef).then(doc => {
        let cData = doc.data();

        let agree = cData.voteAgreeCount;
        let disagree = cData.voteDisagreeCount;
        let pass = cData.votePassCount;

        if (data.vote == "agree") colRef.update({ voteAgreeCount: agree + 1 });
        else if (data.vote == "disagree")
          colRef.update({ voteDisagreeCount: disagree + 1 });
        else colRef.update({ votePassCount: pass + 1 });

        colRef
          .collection("contributionPublicVotes")
          .doc(data.userIP)
          .set(data)
          .then(() => {
            console.log("contribution vote saved.");
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .then(() => {
      return res.status(201).json({
        code: "vote/added",
        message: "contribution vote by user added."
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
