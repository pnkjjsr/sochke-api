// First Home Request for Session without login
exports.postSession = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: req.body.createdAt
  };

  let colRef = db.collection("sessions");
  let docRef = colRef.doc();
  data.id = docRef.id;
  docRef.set(data).then(() => {
    return res.json({
      status: "done",
      code: "session/open",
      message: "url hit by client."
    });
  });
};

// Get all respond
exports.test = (req, res) => {
  const { db } = require("../../utils/admin");

  let colRef = db
    .collection("sessions")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.json({
          status: "done",
          code: "session/empty",
          message: "session is empty"
        });
      } else {
        res.json({
          status: "done",
          code: "session/data",
          message: "so many sessions."
        });
      }
    });
};
