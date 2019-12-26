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
    .limit(10);
  let contData = {
    contributions: []
  };
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
        });
      })
      .then(() => {
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
    voteCount: 0,
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
