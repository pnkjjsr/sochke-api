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

exports.addPincodeArea = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = req.body;

  let colRef = db.collection("constituencyArea");
  let docRef = colRef.doc();
  data.id = docRef.id;
  let query = colRef.where("pincode", "==", data.pincode);
  query
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        data.district = data.area[0].district || "";
        data.division = data.area[0].division || "";
        data.regionName = data.area[0].regionName || "";
        data.circleName = data.area[0].circleName || "";
        data.taluk = data.area[0].taluk || "";
        data.state = data.area[0].state || "";

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
