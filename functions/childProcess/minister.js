const { googleSheet } = require("../utils/sheet");
const { db } = require("../utils/admin");

process.on("message", type => {
  googleSheet("1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s", type).then(
    ministers => {
      let ministerRef = db.collection(type);
      ministers.map(minister => {
        let data = {
          createdAt: new Date().toISOString(),
          name: minister[0],
          constituency: minister[1],
          winner: minister[2] || "",
          year: minister[3] || "",
          type: minister[4] || "",
          party: minister[5] || "",
          partyShort: minister[6] || "",
          assets: minister[7] || "",
          liabilities: minister[8] || "",
          cases: minister[9] || "",
          age: minister[10] || "",
          education: minister[11] || "",
          address: minister[12] || "",
          state: minister[13] || "",
          pincode: minister[14] || "",
          photoUrl: minister[15] || ""
        };

        ministerRef
          .where("constituency", "==", data.constituency)
          .where("name", "==", data.name)
          .where("year", "==", data.year)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              console.log(
                `${data.name}, ${data.constituency}, ${year} This Constituency already had minister.`
              );
            } else {
              ministerRef.add(data).then(ref => {
                let uid = ref.id;
                ministerRef.doc(uid).update({
                  uid: uid
                });
                console.log("Added document with ID: ", uid, data.name);
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  );
});
