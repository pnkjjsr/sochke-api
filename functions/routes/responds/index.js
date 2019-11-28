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

  let respondsRef = db.collection("responds");
  let queryRef = respondsRef
    .where("uid", "==", data.uid)
    .orderBy("createdAt", "desc");

  let getDoc = queryRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        empty = "No such document!";
      }
      snapshot.forEach(doc => {
        respond.push(doc.data());
      });
    })
    .then(() => {
      if (!empty) {
        return res.json(respond);
      } else {
        return res.json({
          code: "respond/empty",
          status: "done",
          message: empty
        });
      }
    })
    .catch(err => {
      res.status(404).json(err);
    });
};

// Add respond
exports.addRespond = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString(),
    uid: req.body.uid,
    type: req.body.type,
    respond: req.body.respond,
    imageUrl: req.body.imageUrl || ""
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
    uid: req.body.uid
  };

  let likeRef = db.collection("likes");

  let queryRef = likeRef
    .where("rid", "==", data.rid)
    .where("uid", "==", data.uid);

  queryRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        let newLikeRef = likeRef.doc();
        data.id = newLikeRef.id;
        let setDoc = newLikeRef.set(data).then(ref => {
          return res.json({
            status: "done",
            message: "Like added successfully"
          });
        });
      }

      snapshot.forEach(doc => {
        likeRef
          .doc(doc.id)
          .delete()
          .then(() => {
            return res.json({
              status: "done",
              message: "This respond Like removed from this user."
            });
          });
      });
    })
    .catch(err => {
      res.status(404).json(err);
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
exports.opinion = async (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    rid: req.body.rid
  };
  let opinion = [];
  let empty = "";

  let opinionRef = db.collection("opinions");
  let userRef = db.collection("users");
  let queryRef = opinionRef
    .where("rid", "==", data.rid)
    .orderBy("createdAt", "desc");

  let getDoc = await queryRef
    .get()
    .then(async snapshot => {
      if (snapshot.empty) {
        empty = "No opinion on this respond yet!";
      }
      await snapshot.forEach(async doc => {
        let oData = await doc.data();

        let getDoc = await userRef
          .doc(oData.uid)
          .get()
          .then(async doc => {
            console.log(1);
            oData.name = await doc.data().name;
            oData.photoURL = await doc.data().photoURL;
            await opinion.push(doc.data());
          })
          .catch(err => {
            res.status(404).json(err);
          });
      });
    })
    .then(() => {
      if (!empty) {
        return res.json(opinion);
      } else {
        return res.json({
          code: "opinion/empty",
          status: "done",
          message: empty
        });
      }
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
