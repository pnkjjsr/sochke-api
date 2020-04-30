exports.covidUserAdd = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString(),
    ip: req.body.ip,
  };

  let docRef = db.collection("covidUsers").doc();
  data.id = docRef.id;

  docRef
    .set(data)
    .then(() => {
      return res.status(201).json({
        code: "covid-user/added",
        message: "User access on covid added in databse successfully.",
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.covidLocationAdd = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: new Date().toISOString(),
    ip: req.body.ip,
    email: req.body.email,
    location: req.body.location,
  };

  let docRef = db.collection("covidLocations").doc();
  data.id = docRef.id;

  docRef
    .set(data)
    .then(() => {
      return res.status(201).json({
        code: "covid-location/add",
        message: "Covid location by user add in databse successfully.",
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
