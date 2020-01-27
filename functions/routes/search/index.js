exports.search = (req, res) => {
  const { db } = require("../../utils/admin");

  const data = {
    keyword: req.body.keyword
  };

  let searchData = {
    users: [],
    ministers: []
  };
  let colRef = db.collection("users");
  let queryUser = colRef.where("searchTags", "array-contains", data.keyword);

  let transaction = db
    .runTransaction(t => {
      return t
        .get(queryUser)
        .then(snapshot => {
          snapshot.forEach(doc => {
            let uData = doc.data();

            let uDataN = {
              id: uData.id,
              userName: uData.userName,
              displayName: uData.displayName,
              photoURL: uData.photoURL
            };

            searchData.users.push(uDataN);
          });

          let queryMinister = db
            .collection("ministers")
            .where("searchTags", "array-contains", data.keyword)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let mData = doc.data();
                let mDataN = {
                  id: mData.id,
                  userName: mData.userName,
                  name: mData.name,
                  photoUrl: mData.photoUrl,
                  year: mData.year,
                  type: mData.type,
                  constituency: mData.constituency,
                  party: mData.party,
                  partyShort: mData.partyShort
                };
                searchData.ministers.push(mDataN);
              });
            })
            .catch(err => {
              console.log(err);
            });

          return Promise.all([queryMinister]);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(() => {
      res.status(200).json(searchData);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};
