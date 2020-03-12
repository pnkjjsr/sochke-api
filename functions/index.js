const functions = require("firebase-functions");
const app = require("express")();
const main = require("express")();
const cors = require("cors");

const { checkIfAuthenticated } = require("./utils/middlewareFirebseJWT");

//** Main Express API setting */
//** ======================================================== */
main.use(cors());
main.use("/v1", app);
exports.api = functions.region("asia-east2").https.onRequest(main);

app.use(checkIfAuthenticated);
//** ======================================================== */
//** ======================================================== */

// Admin APIs
const adminRoutes = require("./routesAdmin");
app.post("/x-login", adminRoutes.login);

//** ======================================================== */
//** ======================================================== */

// Test Hit
const { postSession, test } = require("./routes/session");
app.post("/test", test);

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
  updatePassword,
  believe,
  rethink,
  postFeedback
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
  ministers,
  minister,
  ministerType,
  editMinister,
  getConstituencyMinster,
  ministerVote,
  ministerVoted,
  ministerValue,
  ministerConnection
} = require("./routes/ministers");

// party routes
const { party, addParty, editParty } = require("./routes/parties");

// Locations Routes
const { stateZones, addPincodeArea } = require("./routes/locations");

// Election routes
const { electionYears } = require("./routes/elections");

// Cron Jobs
const {
  cronMinister,
  cronPolls,
  cronConstituencies,
  cronAddMinisterPhoto,
  cronUpdateUserSearchTag,
  cronUpdateMinisterSearchTag
} = require("./routes/crons");

// Poll
const { getPoll, postPoll } = require("./routes/polls");

// Pages
const { getProfile, getHome, getMinister } = require("./routes/pages");

// Contribution
const {
  contribution,
  addContribution,
  voteContribution
} = require("./routes/contributions");

// Search
const { search } = require("./routes/search");

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
app.post("/update-password", updatePassword);
app.post("/i-believe", believe);
app.post("/rethink", rethink);
app.post("/post-feedback", postFeedback);

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
app.post("/ministers", ministers);
app.post("/minister/:id", minister);
app.post("/minister-type", ministerType);
app.post("/edit-minister", editMinister);
app.post("/constituency-minister", getConstituencyMinster);
app.post("/minister-vote", ministerVote);
app.post("/minister-voted", ministerVoted);
app.post("/minister-value", ministerValue);
app.post("/minister-connection", ministerConnection);

// Party
app.post("/party", party);
app.post("/add-party", addParty);
app.post("/edit-party", editParty);

// Election
app.post("/election-years", electionYears);

// Locations
app.post("/state-zones", stateZones);
app.post("/add-pincode-area", addPincodeArea);

// Cron Jobs
app.post("/add-ministers", cronMinister);
app.post("/add-polls", cronPolls);
app.post("/add-constituencies", cronConstituencies);
app.post("/add-minister-photoURL", cronAddMinisterPhoto);
app.post("/update-user-searchTags", cronUpdateUserSearchTag);
app.post("/update-minister-searchTags", cronUpdateMinisterSearchTag);

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
app.post("/vote-contribution", voteContribution);

// Search
app.post("/search", search);
