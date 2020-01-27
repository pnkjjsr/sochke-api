exports.createTagArr = words => {
  let wordArr = [];
  let curName = "";

  words.split(" ").forEach(word => {
    curName += ` ${word}`;
    wordArr.push(curName.trim());
  });

  return wordArr;
};
