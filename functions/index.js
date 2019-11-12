const functions = require('firebase-functions');
const app = require('express')();
const main = require('express')();
const cors = require('cors');

const {
    db
} = require('./utils/admin');

// user routes
const {
    signup,
    getLocation,
    updateLocation,
    login,
    sendEmailVerification,
    getUserDetails,
    addUserDetails,
    updatePhone,
    verifyPhone
} = require('./routes/users');

// ministers routes
const {
    councillor,
    addCouncillor,
    mla,
    addMla,
    mp,
    addMp,
    minister,
    ministerType,
    editMinister
} = require("./routes/ministers");

// party routes
const {
    party,
    addParty,
    editParty
} = require("./routes/parties");

// Locations Routes
const {
    stateZones
} = require("./routes/locations");


// Election routes
const {
    electionYears
} = require("./routes/elections");

// Cron Jobs
const {
    cronCouncillors,
    cronMlas,
    cronMps
} = require("./routes/crons");


main.use(cors());
main.use('/v1', app)
exports.api = functions.https.onRequest(main);

// User routes
app.post('/signup', signup);
app.post('/location', updateLocation);
app.post('/getLocation', getLocation);
app.post('/login', login);
app.post('/user', getUserDetails);
app.post('/addUserDetails', addUserDetails);
app.post('/email', sendEmailVerification);
app.post('/phone', updatePhone);
app.post('/verifyPhone', verifyPhone);

// Ministers Routes
app.post('/councillor', councillor);
app.post('/add-councillor', addCouncillor);
app.post('/mla', mla);
app.post('/add-mla', addMla);
app.post('/mp', mp);
app.post('/add-mp', addMp);
app.post('/minister', minister)
app.post('/minister-type', ministerType)
app.post('/edit-minister', editMinister)

// Party
app.post('/party', party);
app.post('/add-party', addParty);
app.post('/edit-party', editParty);

// Election
app.post('/election-years', electionYears);

// Locations
app.post('/state-zones', stateZones);

// Cron Jobs
app.post('/add-councillors', cronCouncillors);
app.post('/add-mlas', cronMlas);
app.post('/add-mps', cronMps);