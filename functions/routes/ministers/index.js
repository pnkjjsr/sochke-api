const {
    admin,
    db
} = require('../../utils/admin');
const {
    validateCouncillorData,
    validateAddCouncillorData
} = require('./validators');

exports.councillor = (req, res) => {
    const data = {
        'constituency': req.body.pincode
    }

    // const {
    //     valid,
    //     errors
    // } = validateCouncillorData(data);
    // if (!valid) return res.status(400).json(errors);

    let councillorRef = db.collection('councillors');
    let constituencyRef = councillorRef.where('constituency', '==', data.constituency)
    let winnerRef = constituencyRef.where('winner', '==', true)

    winnerRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    messsage: "No matching documents."
                })
                return;
            }
            snapshot.forEach(doc => {
                let councillorData = doc.data()
                return res.json(councillorData);
            });
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}
exports.addCouncillor = (req, res) => {
    const data = {
        "createdAt": new Date().toISOString(),
        "winner": false,
        "year": req.body.year,
        "pincode": req.body.pincode,
        "constituency": req.body.constituency,
        "cases": req.body.cases,
        "education": req.body.education,
        "party": req.body.party,
        "partyShort": req.body.partyShort,
        "address": req.body.address,
        "liabilities": req.body.liabilities,
        "state": req.body.state,
        "assets": req.body.assets,
        "name": req.body.name,
        "zone": req.body.zone,
        "age": req.body.age,
        "photoUrl": req.body.photoUrl || "",
        "type": req.body.type
    }

    const {
        valid,
        errors
    } = validateAddCouncillorData(data);
    if (!valid) return res.status(400).json(errors);

    let councillorRef = db.collection('councillors');
    let constituencyRef = councillorRef.where('constituency', '==', data.constituency)
    let partyShortRef = constituencyRef.where('partyShort', '==', data.partyShort)

    partyShortRef.get()
        .then(snapshot => {
            if (!snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    messsage: "This Constituency already had councillor."
                })
            } else {
                console.log(data);

                let newCouncillorRef = councillorRef.add(data).then(ref => {
                    console.log('Added document with ID: ', ref.id);
                    db.collection('councillors').doc(ref.id).update({
                        uid: ref.id
                    }).then(ref => {
                        return res.json({
                            status: 'done',
                            message: "Location update in user document"
                        });
                    })

                })
            }
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}

exports.mla = (req, res) => {
    const data = {
        'constituency': req.body.pincode
    }

    // const {
    //     valid,
    //     errors
    // } = validateCouncillorData(data);
    // if (!valid) return res.status(400).json(errors);

    let mlaRef = db.collection('mlas');
    let queryRef = mlaRef.where('constituency', '==', data.constituency)

    queryRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    messsage: "No matching documents."
                })
            }
            snapshot.forEach(doc => {
                let mlaData = doc.data()
                return res.json(mlaData);
            });
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}
exports.addMla = (req, res) => {

    const mlaData = {
        "createdAt": new Date().toISOString(),
        "pincode": req.body.pincode,
        "constituency": req.body.constituency,
        "cases": req.body.cases,
        "education": req.body.education,
        "party": req.body.party,
        "partyShort": req.body.partyShort,
        "address": req.body.address,
        "liabilities": req.body.liabilities,
        "state": req.body.state,
        "assets": req.body.assets,
        "name": req.body.name,
        "age": req.body.age,
        "year": req.body.year,
        "photoUrl": req.body.photo || ""
    }


    // const {
    //     valid,
    //     errors
    // } = validateAddCouncillorData(data);
    // if (!valid) return res.status(400).json(errors);

    let mlaRef = db.collection('mlas');
    let queryRef = mlaRef.where('constituency', '==', mlaData.constituency)

    queryRef.get()
        .then(snapshot => {
            if (!snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    messsage: "This Constituency already had mla."
                })
            } else {
                console.log(mlaData);

                let newMlaRef = mlaRef.add(mlaData).then(ref => {
                    console.log('Added document with ID: ', ref.id);
                    db.collection('mlas').doc(ref.id).update({
                        uid: ref.id
                    }).then(ref => {
                        return res.json({
                            status: 'done',
                            message: "MLA update."
                        });
                    })

                })
            }
        })
        .catch(error => {
            console.log(error);

            return res.status(400).json(error)
        });
}


exports.mp = (req, res) => {
    const data = {
        'constituency': req.body.district
    }

    // const {
    //     valid,
    //     errors
    // } = validateCouncillorData(data);
    // if (!valid) return res.status(400).json(errors);

    let mpRef = db.collection('mps');
    let queryRef = mpRef.where('constituency', '==', data.constituency)

    queryRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    messsage: "No matching zone."
                })
            }
            snapshot.forEach(doc => {
                let mpData = doc.data()
                return res.json(mpData);
            });
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}
exports.addMp = (req, res) => {
    const mpData = {
        "createdAt": new Date().toISOString(),
        "pincode": req.body.pincode,
        "constituency": req.body.constituency,
        "cases": req.body.cases,
        "education": req.body.education,
        "party": req.body.party,
        "partyShort": req.body.partyShort,
        "address": req.body.address,
        "liabilities": req.body.liabilities,
        "area": req.body.area,
        "state": req.body.state,
        "assets": req.body.assets,
        "name": req.body.name,
        "zone": req.body.zone,
        "age": req.body.age
    }

    // const {
    //     valid,
    //     errors
    // } = validateAddCouncillorData(data);
    // if (!valid) return res.status(400).json(errors);

    let mpRef = db.collection('mps');
    let queryRef = mpRef.where('constituency', '==', mpData.constituency)

    queryRef.get()
        .then(snapshot => {
            if (!snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    messsage: "This Constituency already has mp."
                })
            } else {
                let newMpRef = mpRef.add(mpData).then(ref => {
                    console.log('Added document with ID: ', ref.id);
                    db.collection('mps').doc(ref.id).update({
                        uid: ref.id
                    }).then(ref => {
                        return res.json({
                            status: 'done',
                            message: "MP update."
                        });
                    })

                })
            }
        })
        .catch(error => {
            console.log(error);

            return res.status(400).json(error)
        });
}


exports.minister = (req, res) => {
    const _res = res
    let ministerData = []


    let councillorRef = db.collection('councillors').limit(5);
    let mlasRef = db.collection('mlas').limit(5);
    let mpsRef = db.collection('mps').limit(5);

    councillorRef.get()
        .then(async councillors => {
            await councillors.forEach((doc) => {
                ministerData.push(doc.data())
            });
        })
        .then(async () => {
            await mlasRef.get().then(mlas => {
                mlas.forEach((doc) => {
                    ministerData.push(doc.data())
                });
            })
        })
        .then(async () => {
            await mpsRef.get().then(mps => {
                mps.forEach((doc) => {
                    ministerData.push(doc.data())
                });
            })
        })
        .then(async () => {
            return _res.json(ministerData)
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}

exports.ministerType = (req, res) => {
    let data = []
    let ministerTypeRef = db.collection('minister_type').orderBy('order', 'desc');
    ministerTypeRef.get()
        .then(async snapshot => {
            await snapshot.forEach(doc => {
                data.push(doc.data())
            });
            return res.json(data)
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
}

exports.editMinister = (req, res) => {
    const ministerData = {
        "updatedAt": new Date().toISOString(),
        "uid": req.body.uid,
        "type": req.body.type,
        "year": req.body.year,
        "state": req.body.state,
        "constituency": req.body.constituency,
        "party": req.body.party,
        "partyShort": req.body.partyShort,
        "name": req.body.name,
        "photoUrl": req.body.photoUrl || "",
        "age": req.body.age,
        "education": req.body.education,
        "address": req.body.address,
        "pincode": req.body.pincode,
        "cases": req.body.cases,
        "assets": req.body.assets,
        "liabilities": req.body.liabilities,
        "winner": req.body.winner,
    }

    // const {
    //     valid,
    //     errors
    // } = validateAddCouncillorData(data);
    // if (!valid) return res.status(400).json(errors);

    let updateMinister = db.collection(`${ministerData.type}s`).doc(ministerData.uid);
    updateMinister.update(ministerData)
        .then(function () {
            res.status(200).json({
                "message": `${ministerData.name} Minister updated`
            })
        });
}