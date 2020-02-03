exports.createTagArr = words => {
  let wordArr = [];
  let curName = "";

  words.split(" ").forEach(word => {
    let lowerCase = word.toLowerCase();

    curName += ` ${lowerCase}`;
    wordArr.push(curName.trim());
  });

  return wordArr;
};
