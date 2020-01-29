exports.randomUID = () => {
  let uidArr = [
    "qwO50tOcKuPlXgz9hni4TSxeIiw1",
    "vSIs7pkFOrfxf0BZtTeQ4qrSJCE2",
    "OxFxRzjfOma11xuXFIYyVYGhDKU2"
  ];
  var randUID = uidArr[Math.floor(Math.random() * uidArr.length)];
  return randUID;
};
