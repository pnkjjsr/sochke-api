exports.randomUID = () => {
  let uidArr = [
    "9hztuSGt5Vd2bVT7oS2L27bbqyz2",
    "kwK280XG0uS1cTfj5l8PIEuSDCI3",
    "yRnpVPCqXPdvfL05jBqoHPQqpH32"
  ];
  var randUID = uidArr[Math.floor(Math.random() * uidArr.length)];
  return randUID;
};
