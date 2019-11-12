const {
    admin,
    db
} = require('../../utils/admin');

exports.electionYears = (req, res) => {
    const electionYears = []
    const data = {
        "type": req.body.type,
        "state": req.body.state
    }

    let electionYearsRef = db.collection('election_years');
    let queryState = electionYearsRef.where('state', '==', data.state)
    let queryElection = queryState.where('election', '==', data.type)
    queryElection.get()
        .then(snapshot => {
            if (snapshot.empty) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'No matching documents.'
                })
            } else {
                snapshot.forEach(doc => {
                    electionYears.push(doc.data())
                });
                return res.json(electionYears);
            }
        })
        .catch(error => {
            return res.status(400).json(error)
        })
}