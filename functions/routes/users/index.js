const firebase = require("firebase");

const {
  validateSignupData,
  validateLocationData,
  validateLoginData,
  validateUserDetails,
  validateMobileData,
  validateOTPData,
  validateRespond,
  validatePassword,
  validatePhotoData,
  validateNameData
} = require("./validators");

// Log user in
exports.login = (req, res) => {
  let userData = {
    uid: req.body.uid
  };
  const { valid, errors } = validateLoginData(userData);

  if (!valid) return res.status(400).json(errors);

  const { db } = require("../../utils/admin");
  db.doc(`/users/${userData.uid}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json(error);
      } else {
        let data = doc.data();
        delete data.password;
        return res.status(201).json({
          id: data.id,
          email: data.email,
          countryCode: data.countryCode,
          phoneNumber: data.mobile,
          displayName: data.displayName,
          photoURL: data.photoURL,
          constituency: data.constituency,
          area: data.area,
          district: data.district,
          division: data.division,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          userName: data.userName,
          leaderCount: data.leaderCount,
          believerCount: data.believerCount
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(400).json(error);
    });
};

// Sign users up
exports.signup = (req, res) => {
  const { db } = require("../../utils/admin");
  let userName = req.body.email.match(/^(.+)@/)[1];
  let data = {
    createdAt: new Date().toISOString(),
    id: req.body.uid,
    userType: req.body.userType,
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    countryCode: "+91",
    phoneNumber: req.body.mobile,
    phoneVerified: false,
    displayName: "",
    photoURL: "",
    area: req.body.area,
    district: req.body.district,
    division: req.body.division,
    state: req.body.state,
    pincode: req.body.pincode,
    country: req.body.country,
    userName: userName,
    leaderCount: 0,
    believerCount: 0
  };

  const { valid, errors } = validateSignupData(data);

  if (!valid) {
    return res.status(400).json(errors);
  }

  db.collection("constituencies")
    .where("area", "==", data.area)
    .where("district", "==", data.district)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let cData = doc.data();
        data.constituency = cData.constituency;

        db.doc(`/users/${data.id}`)
          .set(data)
          .then(() => {
            return res.status(201).json({
              id: data.id,
              email: data.email,
              countryCode: "+91",
              phoneNumber: data.mobile,
              displayName: "",
              photoURL: "",
              constituency: data.constituency,
              area: data.area,
              district: data.district,
              division: data.division,
              state: data.state,
              pincode: data.pincode,
              country: data.country,
              userName: userName,
              leaderCount: 0,
              believerCount: 0
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
};

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

exports.getLocation = (req, res) => {
  const { db } = require("../../utils/admin");
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
  const { db } = require("../../utils/admin");
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
  const { db } = require("../../utils/admin");
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
  const { db } = require("../../utils/admin");
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

exports.verifyPassword = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    uid: req.body.uid,
    password: req.body.password
  };
  const { valid, errors } = validatePassword(data);
  if (!valid) return res.status(400).json(errors);

  let usersRef = db.collection("users");
  let getDoc = usersRef
    .doc(data.uid)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.json({
          code: "user/empty",
          status: "done",
          message: "There is no user, Signout the website."
        });
      } else {
        var base64 = require("base-64");
        var utf8 = require("utf8");

        let uData = doc.data();
        let encoded = uData.password;
        let bytes = base64.decode(encoded);
        let decodedPassword = utf8.decode(bytes);
        if (data.password == decodedPassword) {
          res.json({
            code: "password/match",
            status: "done",
            message: "Password matched successfully"
          });
        } else {
          res.json({
            code: "password/not-match",
            status: "done",
            message: "Current password is not valid."
          });
        }
      }
    })
    .catch(error => {
      return res.status(400).json(error);
    });
};

exports.logout = (req, res) => {
  firebase.initializeApp(config);
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
  firebase.initializeApp(config);
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
  const { db } = require("../../utils/admin");
  let data = {
    uid: req.body.uid,
    displayName: req.body.displayName,
    bio: req.body.bio,
    dateOfBirth: req.body.dateOfBirth,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender
  };

  const { valid, errors } = validateUserDetails(data);

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
  const { db } = require("../../utils/admin");
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
  const { db } = require("../../utils/admin");
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
    const { admin } = require("../../utils/admin");
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
        const { db } = require("../../utils/admin");
        const config = require("../../firebaseConfig");
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

exports.registeredEmail = (req, res) => {
  const { db } = require("../../utils/admin");
  let data = {
    email: req.body.email
  };
  let usersRef = db.collection("users");
  let queryRef = usersRef
    .where("email", "==", data.email)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.json({
          code: "email/not-register",
          message: "Email ID not registerd."
        });
      } else {
        return res.json({
          code: "email/register",
          message: "Email ID registerd."
        });
      }
    });
};

exports.markNotificationsRead = (req, res) => {
  const { db } = require("../../utils/admin");
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

// Add User Photo
exports.addUserPhoto = (req, res) => {
  const { db } = require("../../utils/admin");
  let data = {
    uid: req.body.uid,
    photoURL: req.body.photoURL
  };

  const { valid, errors } = validatePhotoData(data);

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

exports.addUserName = (req, res) => {
  const { db } = require("../../utils/admin");
  let data = {
    uid: req.body.uid,
    displayName: req.body.displayName
  };

  const { valid, errors } = validateNameData(data);
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

// Add Leader - Believe true
exports.believe = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    createdAt: req.body.createdAt,
    uid: req.body.uid,
    userName: req.body.userName,
    displayName: req.body.displayName,
    photoURL: req.body.photoURL,
    lid: req.body.lid,
    leaderUserName: req.body.leaderUserName,
    leaderDisplayName: req.body.leaderDisplayName,
    leaderPhotoURL: req.body.leaderPhotoURL,
    believe: true
  };

  let colRef = db.collection("connections");
  let queryRef = colRef
    .where("uid", "==", data.uid)
    .where("lid", "==", data.lid);

  let transaction = db.runTransaction(t => {
    return t
      .get(queryRef)
      .then(snapshot => {
        if (snapshot.empty) {
          let docRef = colRef.doc();
          data.id = docRef.id;
          docRef
            .set(data)
            .then(() => {
              connectionUpdate();

              return res.json({
                status: "done",
                code: "leader/added",
                message: "Leader added successfully"
              });
            })
            .catch(err => {
              return res.status(404).json(err);
            });
        }

        snapshot.forEach(doc => {
          let docRef = doc.data().id;
          let updateData = {
            changedAt: new Date().toISOString(),
            believe: true
          };
          colRef
            .doc(docRef)
            .update(updateData)
            .then(() => {
              connectionUpdate();

              return res.json({
                status: "done",
                code: "leader/added",
                message: "Leader added in believe list."
              });
            });
        });

        let connectionUpdate = () => {
          let usersRef = db.collection("users");

          usersRef
            .doc(data.uid)
            .get()
            .then(doc => {
              let newLeaderCount = doc.data().leaderCount + 1;
              usersRef.doc(data.uid).update({ leaderCount: newLeaderCount });
            });

          usersRef
            .doc(data.lid)
            .get()
            .then(doc => {
              let newBelieverCount = doc.data().believerCount + 1;
              usersRef
                .doc(data.lid)
                .update({ believerCount: newBelieverCount });
            });
        };
      })
      .catch(err => {
        return res.status(404).json(err);
      });
  });
};

// Remove Leader - belive false
exports.rethink = (req, res) => {
  const { db } = require("../../utils/admin");
  const data = {
    lid: req.body.lid,
    uid: req.body.uid
  };

  let colRef = db.collection("connections");
  let querylRef = colRef
    .where("uid", "==", data.uid)
    .where("lid", "==", data.lid);

  let transaction = db.runTransaction(t => {
    return t
      .get(querylRef)
      .then(snapshot => {
        snapshot.forEach(doc => {
          let docRef = doc.data().id;
          let updateData = {
            changedAt: new Date().toISOString(),
            believe: false
          };
          colRef
            .doc(docRef)
            .update(updateData)
            .then(() => {
              connectionUpdate();

              return res.json({
                status: "done",
                code: "leader/rethink",
                message: "Leader removed from believe list."
              });
            });
        });

        let connectionUpdate = () => {
          let usersRef = db.collection("users");

          usersRef
            .doc(data.uid)
            .get()
            .then(doc => {
              let newLeaderCount = doc.data().leaderCount - 1;
              usersRef.doc(data.uid).update({ leaderCount: newLeaderCount });
            });

          usersRef
            .doc(data.lid)
            .get()
            .then(doc => {
              let newBelieverCount = doc.data().believerCount - 1;
              usersRef
                .doc(data.lid)
                .update({ believerCount: newBelieverCount });
            });
        };
      })
      .catch(err => {
        return res.status(404).json(err);
      });
  });
};
