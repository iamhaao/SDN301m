const MongoClient = require("mongodb").MongoClient;
const dboper = require("./operations");
const url = "mongodb://localhost:27017/";
const dbname = "conFusion";

MongoClient.connect(url)
  .then((client) => {
    console.log("Connected correctly to server");
    const db = client.db(dbname);

    dboper
      .insertDocument(
        db,
        {
          name: "Weekend Grand Buffet",
          image: "images/buffet.png",
          label: "New",
          price: "19.99",
          description: "Featuring . . .",
          featured: false,
        },
        "promotions"
      )
      .then((result) => {
        console.log("Insert Document:\n", result);

        return dboper.findDocuments(db, "promotions");
      })
      .then((docs) => {
        console.log("Found Documents:\n", docs);
        return dboper.updateDocument(
          db,
          { name: "Weekend Grand Buffet" },
          { price: "20.99" },
          "promotions"
        );
      })
      .then((result) => {
        console.log("Updated Document:\n", result);

        return dboper.findDocuments(db, "promotions");
      })
      .then((docs) => {
        console.log("Found Updated Documents:\n", docs);
        return dboper.removeDocument(db, "promotions");
      })
      .then((result) => {
        console.log("Remove Collection: ", result);

        return client.close();
      })
      // .then((docs) => {
      //   console.log("Found Updated Documents:\n", docs);

      //   return db.dropCollection("promotions");
      // })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
