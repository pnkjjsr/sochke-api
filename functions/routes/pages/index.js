exports.getHome = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid
  };
  let pageData = {
    responds: [],
    respondVoted: [],
    councillors: [],
    mlas: [],
    mps: [],
    cms: [],
    pms: [],
    polls: []
  };
  let checkVoted = [];

  let colRef = db.collection("users").where("uid", "==", data.uid);

  let transaction = db
    .runTransaction(t => {
      return t
        .get(colRef)
        .then(snapshot => {
          let uData;

          snapshot.forEach(doc => {
            uData = doc.data();
            pageData.userName = uData.userName;
            pageData.displayName = uData.displayName;
            pageData.photoURL = uData.photoURL;
            pageData.area = uData.area;
            pageData.pincode = uData.pincode;
          });

          let allRespond = db
            .collection("responds")
            .where("uid", "==", uData.uid)
            .orderBy("createdAt", "desc")
            .limit(25)
            .get()
            .then(snapshot => {
              snapshot.forEach(async doc => {
                let snapData = doc.data();
                pageData.responds.push(snapData);
                checkVoted.push(snapData.id);
              });

              return new Promise((resolve, reject) => {
                let checkLoop = 0;
                let checkVoteSize = checkVoted.length;

                for (id of checkVoted) {
                  db.collection("respondVotes")
                    .where("uid", "==", uData.uid)
                    .where("rid", "==", id)
                    .where("vote", "==", true)
                    .get()
                    .then(snapshot => {
                      checkLoop++;
                      snapshot.forEach(doc => {
                        pageData.respondVoted.push(doc.data().rid);
                      });

                      if (checkLoop == checkVoteSize) {
                        resolve();
                      }
                    });
                }
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
      return res.status(404).json(err);
    });
};

exports.getProfile = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    userName: req.body.userName
  };

  let pageData = {
    responds: [],
    believers: [],
    leaders: []
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

          pageData.uid = uData.uid;
          pageData.userName = uData.userName;
          pageData.displayName = uData.displayName;
          pageData.photoURL = uData.photoURL;
          pageData.area = uData.area;
          pageData.pincode = uData.pincode;
          pageData.believerCount = uData.believerCount;
          pageData.leaderCount = uData.leaderCount;
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
          .where("lid", "==", uData.uid)
          .where("believe", "==", true)
          .get()
          .then(snapshot => {
            snapshot.docs.map(doc => {
              let believerData = doc.data();
              pageData.believers.push(believerData);
            });
          });

        let leadersRef = db
          .collection("connections")
          .where("uid", "==", uData.uid)
          .where("believe", "==", true)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let leaderData = doc.data();
              pageData.leaders.push(leaderData);
            });
          });

        let believeRef = db
          .collection("connections")
          .where("uid", "==", data.uid)
          .where("lid", "==", uData.uid)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              pageData.believe = false;
            }
            snapshot.forEach(doc => {
              pageData.believe = doc.data().believe;
            });
          });

        return Promise.all([
          respondCount,
          contributionRef,
          respondMediaRef,
          beliversRef,
          leadersRef,
          believeRef
        ]).then(() => {
          res.json(pageData);
        });
      });
    })

    .catch(err => {
      console.log("Transaction failure:", err);
      res.status(404).json(err);
    });
};

exports.getMinister = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    userName: req.body.userName
  };

  let colRef = db.collection("ministers");
  let queryRef = colRef.where("userName", "==", data.userName);
  let pageData = {};
  let transaction = db
    .runTransaction(t => {
      return t.get(queryRef).then(snapshot => {
        let mData = {};
        if (snapshot.empty) {
          pageData = {
            status: "done",
            code: "minister/empty",
            message: "No minister with this name."
          };
        } else {
          snapshot.forEach(doc => {
            mData = doc.data();
            pageData = doc.data();
          });
        }

        let constituencyRef = db
          .collection("constituencies")
          .where("pincode", "==", mData.constituency)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              pageData.constituencyArea = doc.data();
            });
          });

        return Promise.all([constituencyRef]);
      });
    })
    .then(() => {
      return res.json(pageData);
    })
    .catch(err => {
      res.status(404).json(err);
    });
};
