const {
  validateCouncillorData,
  validateAddCouncillorData,
} = require("./validators");

exports.councillor = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    constituency: req.body.pincode,
  };

  let ministers = [];
  let councillorRef = db.collection("councillors");
  let constituencyRef = councillorRef
    .where("constituency", "==", data.constituency)
    .where("winner", "==", true);

  constituencyRef
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(400).json({
          status: "fail",
          messsage: "No matching documents.",
        });
      }
      snapshot.forEach((doc) => {
        ministers.push(doc.data());
      });
    })
    .then(() => {
      return res.json(ministers);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

exports.addCouncillor = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString(),
    winner: false,
    year: req.body.year,
    pincode: req.body.pincode,
    constituency: req.body.constituency,
    cases: req.body.cases,
    education: req.body.education,
    party: req.body.party,
    partyShort: req.body.partyShort,
    address: req.body.address,
    liabilities: req.body.liabilities,
    state: req.body.state,
    assets: req.body.assets,
    name: req.body.name,
    zone: req.body.zone,
    age: req.body.age,
    photoUrl: req.body.photoUrl || "",
    type: req.body.type,
  };

  const { valid, errors } = validateAddCouncillorData(data);
  if (!valid) return res.status(400).json(errors);

  let councillorRef = db.collection("councillors");
  let constituencyRef = councillorRef.where(
    "constituency",
    "==",
    data.constituency
  );
  let partyShortRef = constituencyRef.where(
    "partyShort",
    "==",
    data.partyShort
  );

  partyShortRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        return res.status(400).json({
          status: "fail",
          messsage: "This Constituency already had councillor.",
        });
      } else {
        console.log(data);

        let newCouncillorRef = councillorRef.add(data).then((ref) => {
          console.log("Added document with ID: ", ref.id);
          db.collection("councillors")
            .doc(ref.id)
            .update({
              uid: ref.id,
            })
            .then((ref) => {
              return res.json({
                status: "done",
                message: "Location update in user document",
              });
            });
        });
      }
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

exports.mla = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    constituency: req.body.pincode,
  };

  let ministers = [];
  let mlaRef = db.collection("mlas");
  let queryRef = mlaRef
    .where("constituency", "==", data.constituency)
    .where("winner", "==", true);

  queryRef
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(400).json({
          code: "mla/empty",
          status: "done",
          messsage: "No matching documents.",
        });
      }
      snapshot.forEach((doc) => {
        ministers.push(doc.data());
      });
    })
    .then(() => {
      return res.json(ministers);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

exports.addMla = (req, res) => {
  const { db } = require("../../utils/admin");
  const mlaData = {
    createdAt: new Date().toISOString(),
    pincode: req.body.pincode,
    constituency: req.body.constituency,
    cases: req.body.cases,
    education: req.body.education,
    party: req.body.party,
    partyShort: req.body.partyShort,
    address: req.body.address,
    liabilities: req.body.liabilities,
    state: req.body.state,
    assets: req.body.assets,
    name: req.body.name,
    age: req.body.age,
    year: req.body.year,
    photoUrl: req.body.photo || "",
  };

  let mlaRef = db.collection("mlas");
  let queryRef = mlaRef.where("constituency", "==", mlaData.constituency);

  queryRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        return res.status(400).json({
          status: "fail",
          messsage: "This Constituency already had mla.",
        });
      } else {
        console.log(mlaData);

        let newMlaRef = mlaRef.add(mlaData).then((ref) => {
          console.log("Added document with ID: ", ref.id);
          db.collection("mlas")
            .doc(ref.id)
            .update({
              uid: ref.id,
            })
            .then((ref) => {
              return res.json({
                status: "done",
                message: "MLA update.",
              });
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);

      return res.status(400).json(error);
    });
};

exports.mp = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    constituency: req.body.district,
  };

  let ministers = [];
  let mpRef = db.collection("mps");
  let queryRef = mpRef
    .where("constituency", "==", data.constituency)
    .where("winner", "==", true);

  queryRef
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(400).json({
          status: "fail",
          messsage: "No matching zone.",
        });
      }
      snapshot.forEach((doc) => {
        ministers.push(doc.data());
      });
    })
    .then(() => {
      return res.json(ministers);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

exports.addMp = (req, res) => {
  const { db } = require("../../utils/admin");
  const mpData = {
    createdAt: new Date().toISOString(),
    pincode: req.body.pincode,
    constituency: req.body.constituency,
    cases: req.body.cases,
    education: req.body.education,
    party: req.body.party,
    partyShort: req.body.partyShort,
    address: req.body.address,
    liabilities: req.body.liabilities,
    area: req.body.area,
    state: req.body.state,
    assets: req.body.assets,
    name: req.body.name,
    zone: req.body.zone,
    age: req.body.age,
  };

  let mpRef = db.collection("mps");
  let queryRef = mpRef.where("constituency", "==", mpData.constituency);

  queryRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        return res.status(400).json({
          status: "fail",
          messsage: "This Constituency already has mp.",
        });
      } else {
        let newMpRef = mpRef.add(mpData).then((ref) => {
          console.log("Added document with ID: ", ref.id);
          db.collection("mps")
            .doc(ref.id)
            .update({
              uid: ref.id,
            })
            .then((ref) => {
              return res.json({
                status: "done",
                message: "MP update.",
              });
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);

      return res.status(400).json(error);
    });
};

exports.ministers = (req, res) => {
  const { db } = require("../../utils/admin");
  let ministerData = [];

  let ministersRef = db
    .collection("ministers")
    .orderBy("createdAt", "desc")
    .limit(50);

  ministersRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        ministerData.push(doc.data());
      });

      res.status(200).json(ministerData);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

exports.minister = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    id: req.params.id,
  };

  db.collection("ministers")
    .doc(data.id)
    .get()
    .then((doc) => {
      let userData = doc.data();
      return res.status(200).json(userData);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.ministerType = (req, res) => {
  const { db } = require("../../utils/admin");
  let data = [];
  let ministerTypeRef = db.collection("minister_type").orderBy("order", "desc");
  ministerTypeRef
    .get()
    .then(async (snapshot) => {
      await snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return res.json(data);
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
};

exports.editMinister = (req, res) => {
  const { db } = require("../../utils/admin");
  const ministerData = {
    updatedAt: new Date().toISOString(),
    uid: req.body.uid,
    type: req.body.type,
    year: req.body.year,
    state: req.body.state,
    constituency: req.body.constituency,
    party: req.body.party,
    partyShort: req.body.partyShort,
    name: req.body.name,
    photoUrl: req.body.photoUrl || "",
    age: req.body.age,
    education: req.body.education,
    address: req.body.address,
    pincode: req.body.pincode,
    cases: req.body.cases,
    assets: req.body.assets,
    liabilities: req.body.liabilities,
    winner: req.body.winner,
  };

  let updateMinister = db
    .collection(`${ministerData.type}s`)
    .doc(ministerData.uid);
  updateMinister.update(ministerData).then(function () {
    res.status(200).json({
      message: `${ministerData.name} Minister updated`,
    });
  });
};

exports.getConstituencyMinster = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    type: req.body.type,
    pincode: req.body.pincode,
    district: req.body.district,
  };

  let minister = [];

  let councillorRef = db.collection("councillors");
  let queryRef = councillorRef.where("constituency", "==", data.pincode);
  queryRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          minister.push(doc.data());
        });
      }
    })
    .then(() => {
      let mlaRef = db.collection("mlas");
      let queryRef = mlaRef.where("constituency", "==", data.pincode);
      queryRef
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            snapshot.forEach((doc) => {
              minister.push(doc.data());
            });
          }
        })
        .then(() => {
          let mpRef = db.collection("mps");
          let queryRef = mpRef.where("constituency", "==", data.district);
          queryRef
            .get()
            .then((snapshot) => {
              if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                  minister.push(doc.data());
                });
              }
            })
            .then(() => {
              res.json(minister);
            });
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.ministerVote = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString(),
    uid: req.body.uid,
    mid: req.body.mid,
    vote: req.body.vote,
  };

  let colRef = db.collection("ministers").doc(data.mid);

  let transaction = db
    .runTransaction((t) => {
      return t
        .get(colRef)
        .then((doc) => {
          let mData = doc.data();

          colRef
            .collection("ministerVotes")
            .doc(data.uid)
            .set(data)
            .then(() => {
              console.log(`vote saved`);
            })
            .catch((err) => {
              console.log(err);
            });

          if (data.vote)
            colRef.update({ voteTrueCount: mData.voteTrueCount + 1 });
          else colRef.update({ voteFalseCount: mData.voteFalseCount + 1 });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      return res.json({
        code: "minister/vote",
        status: "done",
        message: "Vote added in minister name.",
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.ministerVoted = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    mid: req.body.mid,
  };

  colRef = db
    .collection("ministers")
    .doc(data.mid)
    .collection("ministerVotes")
    .doc(data.uid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({
          code: "vote/empty",
          message: "User never vote for this minister",
        });
      }

      return res.json({
        code: "vote/voted",
        message: "User already voted for this minister",
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.ministerValue = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    mid: req.body.mid,
  };

  let totalVote = 0;
  let trueVote = 0;
  let colRef = db.collection("ministerVotes");
  let query = colRef.where("mid", "==", data.mid);
  let emptyData = {};
  query
    .get()
    .then(async (snapshot) => {
      if (snapshot.empty) {
        return (emptyData = {
          code: "vote/empty",
          message: "This minister not voted yet.",
        });
      }

      totalVote = snapshot.size;
      await snapshot.forEach((doc) => {
        const vData = doc.data();

        if (vData.vote == true) {
          trueVote++;
        }
      });
    })
    .then(() => {
      if (emptyData.code == "vote/empty") {
        return res.json(emptyData);
      }
      return res.json({
        code: "vote/data",
        vote_total: totalVote,
        vote_true: trueVote,
      });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};

exports.ministerConnection = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    createdAt: req.body.createdAt,
    uid: req.body.uid,
    mid: req.body.mid,
    believe: req.body.believe,
    userName: req.body.userName,
    displayName: req.body.displayName,
    photoURL: req.body.photoURL,
  };

  let colRef = db.collection("ministers").doc(data.mid);
  let pageData = {};

  let transaction = db
    .runTransaction((t) => {
      return t
        .get(colRef)
        .then((doc) => {
          let mData = doc.data();

          colRef
            .collection("ministerConnections")
            .doc(data.uid)
            .set(data)
            .then(() => {
              console.log("connection added");
              pageData = {
                code: "minister/believe",
                message: "Believe saved in minister",
              };
            })
            .catch((err) => {
              console.log(err);
            });

          let currentCount = mData.believeCount;

          if (data.believe) colRef.update({ believerCount: currentCount + 1 });
          else colRef.update({ believerCount: currentCount - 1 });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      return res.status(200).json(pageData);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.getNeta = (req, res) => {
  const { db } = require("../../utils/admin");

  let ministerData = {};
  let empty = false;
  let colRef = db
    .collection("ministers")
    .where("searchTags", "array-contains", "narendra modi");

  let transaction = db
    .runTransaction((t) => {
      return t
        .get(colRef)
        .then((snapshot) => {
          if (snapshot.empty) {
            return (empty = true);
          }

          snapshot.forEach((doc) => {
            let mData = doc.data();
            ministerData = mData;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      if (empty) {
        res.status(200).json({
          code: "minister/empty",
          message: "Minister of this name is not found.",
        });
      }

      res.status(200).json(ministerData);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};

exports.postNeta = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: req.body.createdAt,
    mid: req.body.mid,
    uid: req.body.uid,
    vote: req.body.vote,
  };

  let colRef = db.collection("ministers").doc(data.mid);

  let transaction = db
    .runTransaction((t) => {
      return t
        .get(colRef)
        .then((doc) => {
          let mData = doc.data();

          colRef
            .collection("ministerVotes")
            .doc(data.uid)
            .set(data)
            .then(() => {
              console.log(`vote saved`);
            })
            .catch((err) => {
              console.log(err);
            });

          if (data.vote === "true")
            colRef.update({ voteTrueCount: mData.voteTrueCount + 1 });
          if (data.vote === "false")
            colRef.update({ voteFalseCount: mData.voteFalseCount + 1 });
          if (data.vote === "pass")
            colRef.update({ votePassCount: mData.votePassCount + 1 });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      return res.json({
        code: "minister/vote",
        status: "done",
        message: "Vote added in minister name.",
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
