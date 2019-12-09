// Submit user Poll
exports.postPoll = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAd: new Date().toISOString(),
    uid: req.body.uid,
    pid: req.body.pid,
    poll: req.body.poll
  };

  let colRef = db.collection("pollResults");
  let docRef = colRef.doc();
  data.id = docRef.id;
  docRef.set(data).then(() => {
    return res.json({
      code: "poll/add",
      status: "done",
      message: "Poll answer added."
    });
  });
};

// Get Poll 1 by 1 with check if already Polled
exports.getPoll = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    type: req.body.type
  };

  let colRef = db.collection("polls");
  let query = colRef.where("type", "==", data.type);

  query
    .get()
    .then(async snapshot => {
      if (snapshot.empty) {
        return res.json({
          code: "poll/empty",
          status: "done",
          message: "No poll available in this constituency."
        });
      }

      await snapshot.forEach(doc => {
        let pData = doc.data();
        let pid = pData.id;
        let colRef = db.collection("pollResults");
        let query = colRef.where("uid", "==", data.uid).where("pid", "==", pid);

        query.get().then(snapshot => {
          if (snapshot.empty) {
            return res.json(pData);
          }

          return res.json({
            code: "poll/all-done",
            status: "done",
            message: "No new poll remaining."
          });
        });
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
