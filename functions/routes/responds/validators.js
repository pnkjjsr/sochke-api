const { isEmpty } = require("../../utils/validation");

exports.validateRespond = data => {
  let errors = {};
  if (isEmpty(data.uid)) errors.uid = "respond is empty";
  if (isEmpty(data.type)) errors.type = "respond is empty";
  if (isEmpty(data.respond)) errors.respond = "respond is empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateOpinion = data => {
  let errors = {};
  if (isEmpty(data.uid)) errors.uid = "User ID is not defined";
  if (isEmpty(data.rid)) errors.rid = "Respond ID is not defined";
  if (isEmpty(data.opinion)) errors.opinion = "Opinion is not defined";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
