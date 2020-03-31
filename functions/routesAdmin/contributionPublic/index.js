// Contribution Public
exports.addContributePublic = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    createdAt: req.body.createdAt,
    title: req.body.title,
    description: req.body.desc,
    imgUrl: req.body.imgUrl,
    voteAgreeCount: 0,
    voteDisagreeCount: 0,
    votePassCount: 0,
    opinionCount: 0
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
