// Get all respond
exports.getProfile = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    userName: req.body.userName
  };

  let pageData = {};

  const colRef = db.collection("users").where("userName", "==", data.userName);

  let transaction = db
    .runTransaction(t => {
      return t.get(colRef).then(snapshot => {
        let uid;
        snapshot.forEach(doc => {
          uid = doc.data().uid;
        });

        let respondCount = db
          .collection("responds")
          .where("uid", "==", uid)
          .get()
          .then(snapshot => {
            let respondCount = snapshot.size;
            pageData.respondCount = respondCount;
          });

        let contributionRef = db
          .collection("contributions")
          .where("uid", "==", uid)
          .get()
          .then(snapshot => {
            let contributionCount = snapshot.size;
            pageData.contributionCount = contributionCount;
          });

        let respondMediaRef = db
          .collection("responds")
          .where("uid", "==", uid)
          .where("type", "==", "media")
          .get()
          .then(snapshot => {
            let mediaCount = snapshot.size;
            pageData.mediaCount = mediaCount;
          });

        let beliversRef = db
          .collection("connections")
          .where("leaderId", "==", uid)
          .where("active", "==", true)
          .get()
          .then(snapshot => {
            let beliverCount = snapshot.size;
            pageData.believerCount = beliverCount;
          });

        let leadersRef = db
          .collection("connections")
          .where("uid", "==", uid)
          .where("active", "==", true)
          .get()
          .then(snapshot => {
            let leaderCount = snapshot.size;
            pageData.leaderCount = leaderCount;
          });

        return Promise.all([
          respondCount,
          contributionRef,
          respondMediaRef,
          beliversRef,
          leadersRef
        ]);
      });
    })
    .then(() => {
      res.json(pageData);
    })
    .catch(err => {
      console.log("Transaction failure:", err);
      res.status(404).json(err);
    });
};
