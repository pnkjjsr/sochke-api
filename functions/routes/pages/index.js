// Get all respond
exports.getProfile = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    userName: req.body.userName
  };

  let pageData = {
    responds: []
  };

  const colRef = db.collection("users").where("userName", "==", data.userName);

  let transaction = db
    .runTransaction(t => {
      return t.get(colRef).then(snapshot => {
        if (snapshot.empty) {
          return res.status(200).json({
            status: "done",
            code: "profile/empty",
            message: "no user found."
          });
        }

        let uData;
        snapshot.forEach(doc => {
          uData = doc.data();
          pageData.userName = uData.userName;
          pageData.displayName = uData.displayName;
          pageData.photoURL = uData.photoURL;
          pageData.area = uData.area;
          pageData.pincode = uData.pincode;
        });

        let respondCount = db
          .collection("responds")
          .where("uid", "==", uData.uid)
          .orderBy("createdAt", "desc")
          .limit(25)
          .get()
          .then(snapshot => {
            let respondCount = snapshot.size;
            pageData.respondCount = respondCount;

            snapshot.forEach(doc => {
              let rData = doc.data();
              pageData.responds.push(rData);
            });
          });

        let contributionRef = db
          .collection("contributions")
          .where("uid", "==", uData.uid)
          .get()
          .then(snapshot => {
            let contributionCount = snapshot.size;
            pageData.contributionCount = contributionCount;
          });

        let respondMediaRef = db
          .collection("responds")
          .where("uid", "==", uData.uid)
          .where("type", "==", "media")
          .get()
          .then(snapshot => {
            let mediaCount = snapshot.size;
            pageData.mediaCount = mediaCount;
          });

        let beliversRef = db
          .collection("connections")
          .where("leaderId", "==", uData.uid)
          .where("active", "==", true)
          .get()
          .then(snapshot => {
            let beliverCount = snapshot.size;
            pageData.believerCount = beliverCount;
          });

        let leadersRef = db
          .collection("connections")
          .where("uid", "==", uData.uid)
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

exports.getHome = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid
  };

  let pageData = {
    responds: [],
    councillors: [],
    mlas: [],
    mps: [],
    cms: [],
    pms: [],
    polls: []
  };

  let colRef = db.collection("users").where("uid", "==", data.uid);

  let transaction = db
    .runTransaction(t => {
      return t
        .get(colRef)
        .then(snapshot => {
          let uData;

          snapshot.forEach(doc => {
            uData = doc.data();
          });

          let allRespond = db
            .collection("responds")
            .where("uid", "==", uData.uid)
            .orderBy("createdAt", "desc")
            .limit(25)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.responds.push(snapData);
              });
            });

          let allCouncillor = db
            .collection("councillors")
            .where("constituency", "==", uData.pincode)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.councillors.push(snapData);
              });
            });

          let allMla = db
            .collection("mlas")
            .where("constituency", "==", uData.pincode)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.mlas.push(snapData);
              });
            });

          let allMp = db
            .collection("mps")
            .where("constituency", "==", uData.district)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.mps.push(snapData);
              });
            });

          let allCm = db
            .collection("cms")
            .where("constituency", "==", uData.state)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.cms.push(snapData);
              });
            });

          let allPm = db
            .collection("pms")
            .where("constituency", "==", uData.country)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.pms.push(snapData);
              });
            });

          let allPoll = db
            .collection("polls")
            .where("state", "==", uData.state)
            .limit(10)
            .get()
            .then(snapshot => {
              console.log(snapshot.empty);

              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.polls.push(snapData);
              });
            });

          return Promise.all([
            allRespond,
            allCouncillor,
            allMla,
            allMp,
            allCm,
            allPm,
            allPoll
          ]);
        })
        .catch(err => {
          return res.status(404).json(err);
        });
    })
    .then(() => {
      res.json(pageData);
    })
    .catch(err => {
      console.log("Transaction failure:", err);
      return res.status(404).json(err);
    });
};
