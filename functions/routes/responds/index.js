const { validateRespond, validateOpinion } = require("./validators");

// Get all respond
exports.respond = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    type: req.body.type
  };
  let respond = [];
  let empty = "";
  let results = "";

  let respondsRef = db.collection("responds");
  let queryRef = respondsRef
    .where("uid", "==", data.uid)
    .orderBy("createdAt", "desc")
    .limit(25);

  let transact = db
    .runTransaction(t => {
      let transRef = t.get(queryRef).then(snapshot => {
        getLike(snapshot);
      });
      return transRef;
    })
    .then(() => {
      Promise.all(results).then(() => {
        if (!empty) {
          return res.json(respond);
        } else {
          return res.json({
            code: "respond/empty",
            status: "done",
            message: empty
          });
        }
      });
    })
    .catch(err => {
      console.log("Transaction failure:", err);
      res.status(404).json(err);
    });

  let getLike = async snapshot => {
    if (snapshot.empty) {
      empty = "No such document!";
    } else {
      results = snapshot.docs.map(async doc => {
        let dData = doc.data();

        let opinionsCount = db
          .collection("opinions")
          .where("rid", "==", dData.id);
        await opinionsCount.get().then(snapshot => {
          let count = snapshot.size;
          dData.opinionCount = count;
        });

        let likesCount = db.collection("likes").where("rid", "==", dData.id);
        await likesCount.get().then(snapshot => {
          let count = snapshot.size;
          dData.likeCount = count;
        });

        let likesRef = db.collection("likes");
        let queryDoc = likesRef
          .where("uid", "==", data.uid)
          .where("rid", "==", dData.id);

        await queryDoc.get().then(doc => {
          if (doc.empty) dData.voted = false;
          else dData.voted = true;
          respond.push(dData);
        });
      });
    }
  };
};

// Add respond
exports.addRespond = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: req.body.createdAt,
    uid: req.body.uid,
    type: req.body.type,
    respond: req.body.respond,
    imageUrl: req.body.imageUrl || "",
    voteCount: req.body.voteCount,
    opinionCount: req.body.opinionCount
  };

  const { valid, errors } = validateRespond(data);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let respondsRef = db.collection("responds");
  let newRespondRef = respondsRef.doc();
  data.id = newRespondRef.id;
  let setDoc = newRespondRef.set(data).then(ref => {
    res.json({
      message: "respond added successfully"
    });
  });
};

// Vote respond
exports.voteRespond = (req, res) => {
  const { db } = require("../../utils/admin");

  let data = {
    createdAt: new Date().toISOString(),
    rid: req.body.rid,
    uid: req.body.uid,
    vote: true
  };

  let votesRef = db.collection("respondVotes");

  let queryRef = votesRef
    .where("rid", "==", data.rid)
    .where("uid", "==", data.uid);

  let transaction = db
    .runTransaction(t => {
      return t
        .get(queryRef)
        .then(snapshot => {
          let voteStatus = false;

          if (snapshot.empty) {
            let docRef = votesRef.doc();
            data.id = docRef.id;
            docRef.set(data);
          } else {
            snapshot.forEach(doc => {
              let voteData = doc.data();
              voteStatus = voteData.vote;
              console.log(voteStatus);

              if (!voteData.vote) {
                votesRef.doc(doc.id).update({
                  vote: true
                });
              } else {
                votesRef.doc(doc.id).update({
                  vote: false
                });
              }
            });
          }

          let getRespond = db
            .collection("responds")
            .doc(data.rid)
            .get()
            .then(doc => {
              let voteCount = doc.data().voteCount;
              updateRespond(voteCount);
            });

          let respondRef = db.collection("responds").doc(data.rid);
          let updateRespond = e => {
            if (!voteStatus) {
              respondRef.update({
                voteCount: e + 1
              });
            } else {
              respondRef.update({
                voteCount: e - 1
              });
            }
          };

          return Promise.all([getRespond]);
        })
        .catch(err => {
          return res.status(404).json(err);
        });
    })
    .then(() => {
      return res.json({
        status: "done",
        code: "vote/update",
        message: "Vote update in all collections."
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};

// Get Vote respond
exports.getVoteRespond = (req, res) => {
  const { db } = require("../../utils/admin");

  let data = {
    rid: req.body.rid,
    uid: req.body.uid
  };

  let likeRef = db.collection("likes");

  let queryRef = likeRef
    .where("rid", "==", data.rid)
    .where("uid", "==", data.uid);

  queryRef
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        return res.json({
          code: "vote/added",
          status: "done",
          message: "Vote already done on this respond"
        });
      }

      return res.json({
        code: "vote/empty",
        message: "This respond Like removed from this user."
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
};

// Get all opinion
exports.opinion = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    rid: req.body.rid
  };
  let opinion = [];
  let empty = "";
  let mapPromise = "";

  let opinionRef = db.collection("opinions");

  let queryRef = opinionRef
    .where("rid", "==", data.rid)
    .orderBy("createdAt", "desc")
    .limit(10);

  let getUser = snapshot => {
    if (snapshot.empty) {
      empty = "No opinion on this respond yet!";
    } else {
      mapPromise = snapshot.docs.map(async doc => {
        let oData = doc.data();
        let userRef = db.collection("users");

        await userRef
          .doc(oData.uid)
          .get()
          .then(doc => {
            oData.displayName = doc.data().displayName;
            oData.photoURL = doc.data().photoURL;
            opinion.push(oData);
          });
      });
    }
  };

  let transact = db
    .runTransaction(t => {
      let transRef = t.get(queryRef).then(async snapshot => {
        getUser(snapshot);
      });
      return transRef;
    })
    .then(() => {
      Promise.all(mapPromise).then(() => {
        if (!empty) {
          return res.json(opinion);
        } else {
          return res.json({
            code: "opinion/empty",
            status: "done",
            message: empty
          });
        }
      });
    })
    .catch(err => {
      res.status(404).json(err);
    });
};

// Add Opinion
exports.addOpinion = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString(),
    uid: req.body.uid,
    rid: req.body.rid,
    opinion: req.body.opinion
  };

  const { valid, errors } = validateOpinion(data);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let opinionRef = db.collection("opinions");
  let newOpinionRef = opinionRef.doc();
  data.id = newOpinionRef.id;
  let setDoc = newOpinionRef.set(data).then(ref => {
    res.json({
      status: "done",
      code: "opinion/added",
      message: "Opinion added successfully"
    });
  });
};
