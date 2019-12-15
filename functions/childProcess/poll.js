const { googleSheet } = require("../utils/sheet");
const { db } = require("../utils/admin");

process.on("message", type => {
  googleSheet("1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s", type).then(
    sheeetData => {
      sheeetData.map(row => {
        console.log(row);

        // let data = {
        //   createdAt: new Date().toISOString(),
        //   name: row[0]
        // };
      });
    }
  );
});
