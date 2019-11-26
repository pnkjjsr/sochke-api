const firebase = require("firebase");

const { validateRespond } = require("./validators");

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
        return res.status(404).json({
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
