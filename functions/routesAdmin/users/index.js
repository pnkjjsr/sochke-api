// Admin Login
exports.login = (req, res) => {
  let userData = {
    email: req.body.email,
    password: req.body.password
  };
  const { db } = require("../../utils/admin");

  db.collection("users")
    .where("email", "==", userData.email)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.json({
          code: "user/not-register",
          message: "Email not registered with us."
        });
      }

      snapshot.forEach(doc => {
        let uData = doc.data();

        if (userData.password != uData.password) {
          return res.json({
            code: "user/wrong-password",
            message: "Please enter a correct password."
          });
        }

        if (uData.userType != "admin") {
          return res.json({
            code: "user/not-admin",
            message: "User not registered as admin."
          });
        }

        delete uData.password;
        return res.status(200).json({
          id: uData.id,
          email: uData.email,
          countryCode: uData.countryCode,
          phoneNumber: uData.phoneNumber,
          displayName: uData.displayName,
          photoURL: uData.photoURL,
          constituency: uData.constituency,
          area: uData.area,
          district: uData.district,
          division: uData.division,
          state: uData.state,
          pincode: uData.pincode,
          country: uData.country,
          userName: uData.userName,
          leaderCount: uData.leaderCount,
          believerCount: uData.believerCount,
          bio: uData.bio,
          dateOfBirth: uData.dateOfBirth,
          gender: uData.gender
        });
      });
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};
