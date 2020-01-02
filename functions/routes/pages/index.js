exports.getHome = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid
  };
  let pageData = {
    leaderCount: 0,
    responds: [],
    respondVoted: [],
    councillors: [],
    mlas: [],
    mps: [],
    cms: [],
    pms: [],
    polls: []
  };
  let connectionData = [];
  let leaderData = [];
  let leaderRespondArr = [];

  let userQuery = db.collection("users").where("uid", "==", data.uid);

  let transaction = db
    .runTransaction(t => {
      return t
        .get(userQuery)
        .then(snapshot => {
          let uData;

          snapshot.forEach(doc => {
            uData = doc.data();
          });

          let allLeaderConnection = db
            .collection("connections")
            .where("uid", "==", uData.uid)
            .where("believe", "==", true)
            .get()
            .then(snapshot => {
              pageData.leaderCount = snapshot.size;

              if (snapshot.empty) {
                return (pageData.leaderCount = 0);
              }

              snapshot.forEach(doc => {
                let lData = doc.data();
                connectionData.push(lData);
              });

              allLeaderData(connectionData);
            });

          let allLeaderData = leaders => {
            return new Promise((resolve, reject) => {
              let len = leaders.length;
              let checkLen = 0;
              leaders.map(data => {
                db.collection("users")
                  .doc(data.lid)
                  .get()
                  .then(doc => {
                    let userData = doc.data();
                    leaderData.push(userData);

                    checkLen++;
                    if (len == checkLen) {
                      resolve();
                    }
                  });
              });
            }).then(() => {
              allLeaderRespond(leaderData);
            });
          };

          let allLeaderRespond = leaderData => {
            return new Promise((resolve, reject) => {
              let len = leaderData.length;
              let checkLen = 0;

              leaderData.map(data => {
                db.collection("responds")
                  .where("uid", "==", data.uid)
                  .orderBy("createdAt", "desc")
                  .limit(10)
                  .get()
                  .then(snapshot => {
                    let respond = {};
                    snapshot.forEach(doc => {
                      let respondData = doc.data();

                      respond.userName = data.userName;
                      respond.displayName = data.displayName;
                      respond.photoURL = data.photoURL;
                      respond.constituency = data.area;
                      respond.pincode = data.pincode;
                      respond.type = respondData.type;
                      respond.uid = respondData.uid;
                      respond.imageUrl = respondData.imageUrl;
                      respond.id = respondData.id;
                      respond.createdAt = respondData.createAt;
                      respond.opinionCount = respondData.opinionCount;
                      respond.respond = respondData.respond;
                      respond.voteCount = respondData.voteCount;

                      leaderRespondArr.push(respond);
                    });
                  });

                checkLen++;
                if (len == checkLen) {
                  resolve();
                }
              });
            }).then(() => {
              // not working need to R&D on this
              // mergeRespond(leaderRespondArr);
            });
          };

          // let mergeRespond = respond => {
          //   console.log(respond);
          // };

          let allRespond = db
            .collection("responds")
            .where("uid", "==", uData.uid)
            .orderBy("createdAt", "desc")
            .limit(25)
            .get()
            .then(snapshot => {
              snapshot.forEach(async doc => {
                let snapData = doc.data();
                snapData.userName = uData.userName;
                snapData.displayName = uData.displayName;
                snapData.photoURL = uData.photoURL;
                snapData.area = uData.area;
                snapData.pincode = uData.pincode;

                pageData.responds.push(snapData);
              });

              // return new Promise((resolve, reject) => {
              //   let checkLoop = 0;
              //   let checkVoteSize = checkVoted.length;

              //   for (id of checkVoted) {
              //     db.collection("respondVotes")
              //       .where("uid", "==", uData.uid)
              //       .where("rid", "==", id)
              //       .where("vote", "==", true)
              //       .get()
              //       .then(snapshot => {
              //         checkLoop++;
              //         snapshot.forEach(doc => {
              //           pageData.respondVoted.push(doc.data().rid);
              //         });

              //         if (checkLoop == checkVoteSize) {
              //           resolve();
              //         }
              //       });
              //   }
              // });
            });

          let allRespondVote = db
            .collection("respondVotes")
            .where("uid", "==", uData.uid)
            .where("vote", "==", true)
            .limit(50)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let voteData = doc.data();
                pageData.respondVoted.push(voteData.rid);
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
            allLeaderConnection,
            allRespond,
            allRespondVote,
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
