// Get all respond
exports.test = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid
  };

  let userRef = db.collection("users").doc(data.uid);
  userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.json("No such document!");
      }
    })
    .catch();
};
