// Admin Login
exports.dashboard = (req, res) => {
  const { db } = require("../../utils/admin");

  let pageData = {
    userCount: 0,
    ministerCount: 0,
    respondCount: 0,
    contributionCount: 0
  };

  let query = db.collection("users");

  const transaction = db
    .runTransaction(t => {
      return t
        .get(query)
        .then(snapshot => {
          pageData.userCount = snapshot.size;

          let ministerCount = db
            .collection("ministers")
            .get()
            .then(snapshot => {
              pageData.ministerCount = snapshot.size;
            })
            .catch(err => {
              console.log(err);
            });

          let respondCount = db
            .collection("responds")
            .get()
            .then(snapshot => {
              pageData.respondCount = snapshot.size;
            })
            .catch(err => {
              console.log(err);
            });

          let contributionCount = db
            .collection("contributions")
            .get()
            .then(snapshot => {
              pageData.contributionCount = snapshot.size;
            })
            .catch(err => {
              console.log(err);
            });

          return Promise.all([
            ministerCount,
            respondCount,
            contributionCount
          ]).catch(err => {
            console.log(err);
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(() => {
      return res.status(200).json(pageData);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};
