// First Home Request for Session without login
exports.postSession = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: req.body.createdAt,
  };

  let colRef = db.collection("sessions");
  let docRef = colRef.doc();
  data.id = docRef.id;
  docRef.set(data).then(() => {
    return res.json({
      status: "done",
      code: "session/open",
      message: "url hit by client.",
    });
  });
};

// Test for Number
exports.test = (req, res) => {
  const { db } = require("../../utils/admin");

  let colRef = db
    .collection("visitors")
    .get()
    .then((snapshot) => {
      let count = snapshot.size;
      return res.json(count);
    });
};
