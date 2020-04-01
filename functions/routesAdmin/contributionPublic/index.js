// Contribution Public

exports.contributePublic = (req, res) => {
  let cid = req.params.id;
  const { db } = require("../../utils/admin");

  db.collection("contributionPublic")
    .doc(cid)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          code: "contribute-global/empty",
          message: "No such document!"
        });
      }

      let cpData = doc.data();

      return res.status(200).json(cpData);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};

exports.contributePublicAll = (req, res) => {
  const { db } = require("../../utils/admin");

  db.collection("contributionPublic")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.status(200).json({
          code: "contribution-public/none",
          message: "No contirbution available"
        });
      }
      let cpData = [];

      snapshot.forEach(doc => {
        let cData = doc.data();
        cpData.push(cData);
      });

      return res.status(200).json(cpData);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};

exports.contributePublicAdd = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    createdAt: req.body.createdAt,
    uid: req.body.uid,
    displayName: req.body.displayName,
    title: req.body.title,
    description: req.body.desc,
    imgUrl: req.body.imgUrl,
    voteAgreeCount: 0,
    voteDisagreeCount: 0,
    votePassCount: 0,
    opinionCount: 0,
    status: true
  };

  let colRef = db.collection("contributionPublic");
  let docRef = colRef.doc();
  data.id = docRef.id;

  colRef
    .doc(data.id)
    .set(data)
    .then(() => {
      return res.status(201).json({
        code: "contribute-public/added",
        message: "Public contribution added successfully."
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
