const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { googleSheet } = require('../../utils/sheet');

const { admin, db } = require('../../utils/admin');



exports.cronCouncillors = (req, res) => {
    const type = req.body.type
    googleSheet('1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s', type)
        .then(response => {

            return res.json(response)
        });
    // let partyRef = db.collection('parties');
}
exports.cronMlas = (req, res) => {
    const type = req.body.type
    googleSheet('1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s', type)
        .then((ministers) => {
            return res.json(ministers)
            let ministerRef = db.collection(type)
            let mapPromises = ministers.map(minister => {
                console.log("1");

                let data = {
                    "createdAt": new Date().toISOString(),
                    "name": minister[0],
                    "constituency": minister[1],
                    "winner": minister[2],
                    "year": minister[3],
                    "type": minister[4],
                    "party": minister[5],
                    "partyShort": minister[6],
                    "assets": minister[7],
                    "liabilities": minister[8],
                    "cases": minister[9],
                    "age": minister[10],
                    "education": minister[11],
                    "address": minister[12],
                    "state": minister[13],
                    "pincode": minister[14],
                    "photoUrl": minister[15] || "",
                }
                let query = ministerRef.where('constituency', '==', data.constituency)
                    .get()
                    .then(snapshot => {
                        if (!snapshot.empty) {
                            console.log(`${data.name}, ${data.constituency}, This Constituency already had mla.`);
                        } else {
                            ministerRef.add(data)
                                .then(ref => {
                                    let uid = ref.id;
                                    ministerRef.doc(uid).update({
                                        "uid": uid
                                    })
                                    console.log('Added document with ID: ', uid, data.name);
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                return query
            })

            Promise.all(mapPromises)
                .then(responses => responses.forEach(
                    response => console.log(response)
                ))
                .then(() => {
                    console.log("2");
                    return res.json("Cron run successfully.")
                })
        })
}
exports.cronMps = (req, res) => {
    const type = req.body.type
    googleSheet('1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s', type)
        .then(response => {

            return res.json(response)
        });
    // let partyRef = db.collection('parties');
}