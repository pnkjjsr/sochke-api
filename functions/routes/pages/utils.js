exports.randomUID = () => {
  let uidArr = ["POvOpBFRcKZh9eGF0BAmr0dfd0K3", "iX90XjJCawdgOwbVPNNHVNoUxpc2"];
  var randUID = uidArr[Math.floor(Math.random() * uidArr.length)];
  return randUID;
};
