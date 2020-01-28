exports.getHome = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid
  };
  let pageData = {
    leaderCount: 0,
    responds: [],
    respondVoted: [],
    respondPromoted: [],
    contributions: [],
    contributionCount: "",
    councillors: [],
    mlas: [],
    mps: [],
    cms: [],
    pms: [],
    polls: []
  };

  let colRef = db.collection("users").doc(data.uid);

  let transaction = db
    .runTransaction(t => {
      return t
        .get(colRef)
        .then(doc => {
          let uData = doc.data();

          let allRespond = db
            .collectionGroup("respondBelievers")
            .where("id", "==", data.uid)
            .orderBy("createdAt", "desc")
            .limit(50)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let bData = doc.data();

                db.collection("responds")
                  .doc(bData.rid)
                  .get()
                  .then(doc => {
                    let rData = doc.data();
                    pageData.responds.push(rData);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
            })
            .catch(err => {
              console.log(err);
            });

          const { randomUID } = require("./utils.js");
          let promotedUID = randomUID();
          let promotedRespond = db
            .collection("responds")
            .where("uid", "==", promotedUID)
            .get()
            .then(snapshot => {
              let i = 0;
              snapshot.forEach(doc => {
                let docData = doc.data();
                if (!i) pageData.respondPromoted.push(docData);
                i++;
              });
            })
            .catch(err => {
              console.log(err);
            });

          let allContribution = db
            .collection("contributions")
            .where("uid", "==", uData.id)
            .orderBy("createdAt", "desc")
            .limit(25)
            .get()
            .then(snapshot => {
              pageData.contributionCount = snapshot.size;

              snapshot.forEach(async doc => {
                let snapData = doc.data();
                pageData.contributions.push(snapData);
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
            allRespond,
            allRespondVote,
            promotedRespond,
            allContribution,
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
    contributions: [],
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

          pageData.id = uData.id;
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
          .where("uid", "==", uData.id)
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
          })
          .catch(err => {
            console.log(err);
          });

        let allContribution = db
          .collection("contributions")
          .where("uid", "==", uData.id)
          .orderBy("createdAt", "desc")
          .limit(25)
          .get()
          .then(snapshot => {
            snapshot.forEach(async doc => {
              let snapData = doc.data();
              pageData.contributions.push(snapData);
            });
          })
          .catch(err => {
            console.log(err);
          });

        let contributionRef = db
          .collection("contributions")
          .where("uid", "==", uData.id)
          .get()
          .then(snapshot => {
            let contributionCount = snapshot.size;
            pageData.contributionCount = contributionCount;
          })
          .catch(err => {
            console.log(err);
          });

        let respondMediaRef = db
          .collection("responds")
          .where("uid", "==", uData.id)
          .where("type", "==", "media")
          .get()
          .then(snapshot => {
            let mediaCount = snapshot.size;
            pageData.mediaCount = mediaCount;
          })
          .catch(err => {
            console.log(err);
          });

        let beliversRef = db
          .collection("connections")
          .where("lid", "==", uData.id)
          .where("believe", "==", true)
          .get()
          .then(snapshot => {
            snapshot.docs.map(doc => {
              let believerData = doc.data();
              pageData.believers.push(believerData);
            });
          })
          .catch(err => {
            console.log(err);
          });

        let leadersRef = db
          .collection("connections")
          .where("uid", "==", uData.id)
          .where("believe", "==", true)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let leaderData = doc.data();
              pageData.leaders.push(leaderData);
            });
          })
          .catch(err => {
            console.log(err);
          });

        let believeRef = db
          .collection("connections")
          .where("uid", "==", data.uid)
          .where("lid", "==", uData.id)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              pageData.believe = false;
            }
            snapshot.forEach(doc => {
              pageData.believe = doc.data().believe;
            });
          })
          .catch(err => {
            console.log(err);
          });

        return Promise.all([
          respondCount,
          allContribution,
          contributionRef,
          respondMediaRef,
          beliversRef,
          leadersRef,
          believeRef
        ])
          .then(() => {
            res.json(pageData);
          })
          .catch(err => {
            console.log(err);
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
    userName: req.body.ministerUserName
  };

  let colRef = db.collection("ministers");
  let queryRef = colRef.where("userName", "==", data.userName);

  let pageData = {
    winnerMinister: {},
    ministers: []
  };

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
        }

        snapshot.forEach(doc => {
          mData = doc.data();
          pageData.winnerMinister = doc.data();
        });

        let constituencyMinister = colRef
          .where("type", "==", mData.type)
          .where("constituency", "==", mData.constituency)
          .where("year", "==", mData.year)
          // .where("state", "==", data.state)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              pageData.ministers.push(doc.data());
            });
          })
          .catch(err => {
            console.log(err);
          });

        return Promise.all([constituencyMinister]);
      });
    })
    .then(() => {
      return res.json(pageData);
    })
    .catch(err => {
      res.status(404).json(err);
    });
};
