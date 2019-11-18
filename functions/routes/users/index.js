const { admin, db } = require("../../utils/admin");

const config = require("../../firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLocationData,
  validateLoginData,
  reduceUserDetails,
  validateMobileData,
  validateOTPData,
  validateRespond
} = require("./validators");

// Log user in
exports.login = (req, res) => {
  let userData = {
    uid: req.body.uid
  };
  const { valid, errors } = validateLoginData(userData);

  if (!valid) return res.status(400).json(errors);

  db.doc(`/users/${userData.uid}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json(error);
      } else {
        let data = doc.data();
        return res.status(201).json(data);
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json(error);
    });
};

// Sign users up
exports.signup = (req, res) => {
  const newUser = {
    createdAt: new Date().toISOString(),
    uid: req.body.uid,
    userType: req.body.userType,
    email: req.body.email,
    emailVerified: false,
    countryCode: "+91",
    phoneNumber: req.body.mobile,
    phoneVerified: false,
    displayName: "",
    photoURL: "",
    password: req.body.password,
    area: req.body.area,
    district: req.body.district,
    division: req.body.division,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let userId = newUser.uid;
  let usersRef = db.collection("users");
  usersRef
    .where("email", "==", newUser.email)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        return res.status(400).json({
          message: "Email already sign up with us."
        });
      } else {
        db.doc(`/users/${userId}`)
          .get()
          .then(doc => {
            if (doc.exists) {
              return res.status(400).json({
                handle: "this DOC is already taken"
              });
            } else {
              db.doc(`/users/${userId}`).set(newUser);
            }
          })
          .then(() => {
            return res.status(201).json(newUser);
          })
          .catch(err => {
            if (err.code === "auth/email-already-in-use") {
              return res.status(400).json({
                email: "Email is already is use"
              });
            } else {
              return res.status(500).json(err);
            }
          });
      }
    })
    .catch(err => {
      console.log("Error getting documents", err);
      return res.status(400).json(err);
    });
};

// Get all respond
exports.respond = (req, res) => {
  const data = {
    uid: req.body.uid,
    type: req.body.type
  };
  let respond = [];

  let respondsRef = db.collection("responds");
  let queryRef = respondsRef
    .where("uid", "==", data.uid)
    .orderBy("createdAt", "desc");

  let getDoc = queryRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        res.json({
          message: "No such document!"
        });
        return;
      }
      snapshot.forEach(doc => {
        respond.push(doc.data());
      });
    })
    .then(() => res.json(respond))
    .catch(err => {
      res.status(404).json(err);
    });
};

// Add respond
exports.addRespond = (req, res) => {
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

exports.getLocation = (req, res) => {
  let uid = req.body.uid;
  let userRef = db.collection("users").doc(uid);
  let getDoc = userRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({
          message: "No such document.!"
        });
      } else {
        let data = doc.data();
        return res.status(200).json(data);
      }
    })
    .catch(error => {
      res.status(400).json({
        message: error
      });
    });
};

exports.updateLocation = (req, res) => {
  let token = req.body.token;
  const validationData = {
    token: req.body.token,
    address: req.body.address,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country
  };
  const { valid, errors } = validateLocationData(validationData);

  if (!valid) return res.status(400).json(errors);

  const data = {
    uid: req.body.token,
    address: req.body.address,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country
  };

  db.collection("users")
    .doc(token)
    .update(data)
    .then(function() {
      return res.json({
        status: "done",
        message: "Location update in user document"
      });
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
};

// Update Mobile
exports.updatePhone = (req, res) => {
  const validationData = {
    token: req.body.token,
    country_code: req.body.country_code,
    phoneNumber: req.body.phoneNumber
  };
  const { valid, errors } = validateMobileData(validationData);
  if (!valid) return res.status(400).json(errors);

  let token = req.body.token;
  const data = {
    countryCode: req.body.country_code,
    phoneNumber: req.body.phoneNumber
  };

  db.collection("users")
    .doc(token)
    .update(data)
    .then(() => {
      return res.json({
        status: "done",
        messsage: "Phone update in user document"
      });
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
};
exports.verifyPhone = (req, res) => {
  const validationData = {
    token: req.body.token,
    phoneVerified: req.body.phoneVerified
  };
  const { valid, errors } = validateOTPData(validationData);
  if (!valid) return res.status(400).json(errors);

  let token = req.body.token;
  const data = {
    phoneVerified: req.body.phoneVerified
  };

  db.collection("users")
    .doc(token)
    .update(data)
    .then(() => {
      return res.json({
        status: "done",
        messsage: "Phone verified in user document"
      });
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
};

exports.logout = (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      res.json({
        status: "done",
        message: "Log user out."
      });
    })
    .catch(function(error) {
      res.status(400).json(error);
    });
};

// Send Email Verification
exports.sendEmailVerification = (req, res) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if (!user.emailVerified) {
        user
          .sendEmailVerification()
          .then(function() {
            return res.json({
              status: "done",
              message: "Verification email sent."
            });
          })
          .catch(function(error) {
            return res.status(400).json(error);
          });
      }
    } else {
      return res.status(400).json({
        error: "Not Logged In"
      });
    }
  });
};

// Add user details
exports.addUserDetails = (req, res) => {
  let data = req.body;

  const { valid, errors } = reduceUserDetails(data);

  if (!valid) return res.status(400).json(errors);

  db.doc(`/users/${data.uid}`)
    .update(data)
    .then(() => {
      return res.json({
        status: "done",
        message: "Details added successfully"
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {
    uid: req.body.uid
  };
  db.doc(`/users/${userData.uid}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json(error);
      } else {
        let data = doc.data();
        return res.status(201).json(data);
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json(error);
    });
};
// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
// Upload a profile image for user
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({
    headers: req.headers
  });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({
        error: "Wrong file type submitted"
      });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filepath,
      mimetype
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({
          imageUrl
        });
      })
      .then(() => {
        return res.json({
          message: "image uploaded successfully"
        });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({
          error: "something went wrong"
        });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, {
      read: true
    });
  });
  batch
    .commit()
    .then(() => {
      return res.json({
        message: "Notifications marked read"
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
