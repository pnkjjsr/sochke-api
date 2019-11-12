const {
    admin,
    db
} = require('../../utils/admin');

exports.stateZones = (req, res) => {
    const zones = []
    const data = {
        "state": req.body.state
    }

    let stateZonesRef = db.collection('state_zones');
    let queryState = stateZonesRef.where('state', '==', data.state)

    queryState.get()
        .then(snapshot => {
            if (snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'No matching documents.'
                })
            } else {
                snapshot.forEach(doc => {
                    zones.push(doc.data())
                });
                return res.json(zones);
            }
        })
        .catch(error => {
            return res.status(400).json(error)
        })
}