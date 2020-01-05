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
    polls: [],
    pollVoted: []
  };
  let connectionData = [];
  let leaderData = [];
  let leaderRespondArr = [];

  let userQuery = db.collection("users").where("id", "==", data.uid);

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
            .where("uid", "==", uData.id)
            .where("believe", "==", true)
            .get()
            .then(snapshot => {
              pageData.leaderCount = snapshot.size;

              if (!snapshot.empty) {
                snapshot.forEach(doc => {
                  let lData = doc.data();
                  connectionData.push(lData);
                });

                allLeaderData(connectionData);
              }
            })
            .catch(err => {
              console.log(err);
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
            })
              .then(() => {
                allLeaderRespond(leaderData);
              })
              .catch(err => {
                console.log(err);
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
            })
              .then(() => {
                // not working need to R&D on this
                // mergeRespond(leaderRespondArr);
              })
              .catch(err => {
                console.log(err);
              });
          };

          // let mergeRespond = respond => {
          //   console.log(respond);
          // };

          let allRespond = db
            .collection("responds")
            .where("uid", "==", uData.id)
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
            })
            .catch(err => {
              console.log(err);
            });

          let allRespondVote = db
            .collection("respondVotes")
            .where("uid", "==", uData.id)
            .where("vote", "==", true)
            .limit(50)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let voteData = doc.data();
                pageData.respondVoted.push(voteData.rid);
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allCouncillor = db
            .collection("ministers")
            .where("type", "==", "COUNCILLOR")
            .where("year", "==", "2017")
            .where("constituency", "==", uData.constituency)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.councillors.push(snapData);
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allMla = db
            .collection("ministers")
            .where("type", "==", "MLA")
            .where("year", "==", "2015")
            .where("constituency", "==", uData.constituency)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.mlas.push(snapData);
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allMp = db
            .collection("ministers")
            .where("type", "==", "MP")
            .where("year", "==", "2019")
            .where("constituency", "==", uData.district)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.mps.push(snapData);
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allCm = db
            .collection("ministers")
            .where("type", "==", "CM")
            .where("year", "==", "2015")
            .where("constituency", "==", uData.state)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.cms.push(snapData);
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allPm = db
            .collection("ministers")
            .where("type", "==", "PM")
            .where("year", "==", "2019")
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let snapData = doc.data();
                pageData.pms.push(snapData);
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allPoll = db
            .collection("polls")
            .where("state", "==", uData.state)
            .orderBy("createdAt", "desc")
            .limit(100)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let pollData = doc.data();
                db.collection("polls")
                  .doc(pollData.id)
                  .collection("pollVotes")
                  .doc(uData.id)
                  .get()
                  .then(doc => {
                    if (!doc.exists) {
                      pageData.polls.push(pollData);
                    }
                  });
              });
            })
            .catch(err => {
              console.log(err);
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
          ]).catch(err => {
            console.log(err);
          });
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
      });
    })
    .then(() => {
      return res.json(pageData);
    })
    .catch(err => {
      res.status(404).json(err);
    });
};
