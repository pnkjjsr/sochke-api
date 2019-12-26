const functions = require("firebase-functions");
const app = require("express")();
const main = require("express")();
const cors = require("cors");

const { checkIfAuthenticated } = require("./utils/middlewareFirebseJWT");

//** Main Express API setting */
//** ======================================================== */
main.use(cors());
main.use("/v1", app);
exports.api = functions.https.onRequest(main);

app.use(checkIfAuthenticated);

//** ======================================================== */
//** ======================================================== */

// Test Hit
const { postSession, test } = require("./routes/session");

// user routes
const {
  login,
  signup,
  getLocation,
  updateLocation,
  sendEmailVerification,
  getUserDetails,
  addUserPhoto,
  addUserName,
  addUserDetails,
  updatePhone,
  verifyPhone,
  registeredEmail,
  verifyPassword,
  believe,
  rethink
} = require("./routes/users");

// respond routes
const {
  respond,
  addRespond,
  voteRespond,
  getVoteRespond,
  opinion,
  addOpinion
} = require("./routes/responds");

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
  editMinister,
  getConstituencyMinster,
  ministerVote,
  ministerVoted,
  ministerValue
} = require("./routes/ministers");

// party routes
const { party, addParty, editParty } = require("./routes/parties");

// Locations Routes
const { stateZones, postArea } = require("./routes/locations");

// Election routes
const { electionYears } = require("./routes/elections");

// Cron Jobs
const {
  cronMinister,
  cronCouncillors,
  cronMlas,
  cronMps,
  cronPolls
} = require("./routes/crons");

// Poll
const { getPoll, postPoll } = require("./routes/polls");

// Pages
const { getProfile, getHome, getMinister } = require("./routes/pages");

// Contribution
const { contribution, addContribution } = require("./routes/contributions");

//****************************************************************/
// ** API Request here*/
//****************************************************************/
// Test
app.post("/session", postSession);
app.post("/test", test);

// User routes
app.post("/login", login);
app.post("/signup", signup);
app.post("/location", updateLocation);
app.post("/getLocation", getLocation);
app.post("/user", getUserDetails);
app.post("/add-user-photo", addUserPhoto);
app.post("/add-user-name", addUserName);
app.post("/update-user", addUserDetails);
app.post("/email", sendEmailVerification);
app.post("/phone", updatePhone);
app.post("/verifyPhone", verifyPhone);
app.post("/registered-email", registeredEmail);
app.post("/verify-password", verifyPassword);
app.post("/i-believe", believe);
app.post("/rethink", rethink);

// Responds Routes
app.post("/respond", respond);
app.post("/add-respond", addRespond);
app.post("/vote-respond", voteRespond);
app.post("/get-vote-respond", getVoteRespond);
app.post("/opinion", opinion);
app.post("/add-opinion", addOpinion);

// Ministers Routes
app.post("/councillor", councillor);
app.post("/add-councillor", addCouncillor);
app.post("/mla", mla);
app.post("/add-mla", addMla);
app.post("/mp", mp);
app.post("/add-mp", addMp);
app.post("/minister", minister);
app.post("/minister-type", ministerType);
app.post("/edit-minister", editMinister);
app.post("/constituency-minister", getConstituencyMinster);
app.post("/minister-vote", ministerVote);
app.post("/minister-voted", ministerVoted);
app.post("/minister-value", ministerValue);

// Party
app.post("/party", party);
app.post("/add-party", addParty);
app.post("/edit-party", editParty);

// Election
app.post("/election-years", electionYears);

// Locations
app.post("/state-zones", stateZones);
app.post("/add-area", postArea);

// Cron Jobs
app.post("/add-ministers", cronMinister);
app.post("/add-councillors", cronCouncillors);
app.post("/add-mlas", cronMlas);
app.post("/add-mps", cronMps);
app.post("/add-polls", cronPolls);

// Polls
app.post("/poll", getPoll);
app.post("/add-poll", postPoll);

// ProfilePage
app.post("/page-profile", getProfile);
app.post("/page-home", getHome);
app.post("/page-minister", getMinister);

// Contributions
app.post("/contribution", contribution);
app.post("/add-contribution", addContribution);
