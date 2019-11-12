const {
    admin,
    db
} = require('../../utils/admin');

exports.party = (req, res) => {
    const partyData = []
    let partyRef = db.collection('parties');
    partyRef.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                partyData.push(doc.data())
            });
            return res.json(partyData);
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}

exports.addParty = (req, res) => {
    const partyData = {
        "createdAt": new Date().toISOString(),
        "founded": req.body.founded,
        "fullName": req.body.fullName,
        "shortName": req.body.shortName,
        "photoUrl": req.body.photoUrl
    }

    let partyRef = db.collection('parties');
    let query = partyRef.where('fullName', '==', partyData.fullName).where('shortName', '==', partyData.shortName)
        .get()
        .then(snapshot => {
            if (!snapshot.empty) {
                return res.status(400).json({
                    status: 'fail/already-registered',
                    message: 'Party already created.'
                })
            } else {
                db.collection('parties').add(partyData).then(ref => {
                    let uid = ref.id
                    db.collection('parties').doc(uid).update({
                        uid: uid
                    }).then(ref => {
                        return res.json({
                            status: 'done',
                            message: 'Party successfully added.',
                            uid: uid
                        });
                    })
                });
            }
        })
        .catch(error => {
            return res.status(400).json(error)
        });
}

exports.editParty = (req, res) => {
    const _res = res;
    const partyData = {
        "updatedAt": new Date().toISOString(),
        "uid": req.body.uid,
        "founded": req.body.founded,
        "fullName": req.body.fullName,
        "shortName": req.body.shortName,
        "photoUrl": req.body.photoUrl
    }

    let partyRef = db.collection('parties').doc(partyData.uid);
    partyRef.update(partyData).then(function () {
            return res.json({
                status: 'done',
                message: 'Party successfully updated.',
                name: partyData.fullName
            });
        })
        .catch(error => {
            return _res.status(400).json(error)
        });
}