// Get all respond
exports.test = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    rid: req.body.rid,
    uid: req.body.uid
  };

  let likesRef = db.collection("likes");
  let queryRef = likesRef
    .where("uid", "==", data.uid)
    .where("rid", "==", "121121212");

  queryRef.get().then(snapshot => {
    console.log(snapshot.empty);

    // res.json(doc.data());
  });
};
