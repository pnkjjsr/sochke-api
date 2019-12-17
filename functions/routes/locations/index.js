exports.stateZones = (req, res) => {
  const { admin, db } = require("../../utils/admin");
  const zones = [];
  const data = {
    state: req.body.state
  };

  let stateZonesRef = db.collection("state_zones");
  let queryState = stateZonesRef.where("state", "==", data.state);

  queryState
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.status(400).json({
          status: "fail",
          message: "No matching documents."
        });
      } else {
        snapshot.forEach(doc => {
          zones.push(doc.data());
        });
        return res.json(zones);
      }
    })
    .catch(error => {
      return res.status(400).json(error);
    });
};

exports.postArea = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = req.body;

  let colRef = db.collection("areas");
  let docRef = colRef.doc();
  data.id = docRef.id;
  let query = colRef.where("pincode", "==", data.pincode);
  query
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        docRef
          .set(data)
          .then(() => {
            return res.json({
              status: "done",
              code: "location/added",
              message: "Area saved in with pincode."
            });
          })
          .catch(err => {
            res.status(404).json(err);
          });
      } else {
        return res.json({
          status: "done",
          code: "location/already-added",
          message: "This pincode area already added in our db."
        });
      }
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
