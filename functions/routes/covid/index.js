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
