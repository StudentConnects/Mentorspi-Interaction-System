if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv").config()
}

const { expect } = require("chai");
const Ioredis = require('ioredis');
const { post } = require("./server");

// (async () => {

//   const redis = new Ioredis(process.env.STACKHERO_REDIS_URL_TLS);

//   // Set key "stackhero-example-key" to "abcd"
//   await redis.set('stackhero-example-key', 'abcd');

//   // Get key "stackhero-example-key"
//   const value = await redis.get('stackhero-example-key');
//   console.log(`Key "stackhero-example-key" has value "${value}"`);

//   // Finally delete key "stackhero-example-key"
//   await redis.del('stackhero-example-key');
// redis.disconnect();
// })().catch(error => {
//   console.error('An error occurred!\n', error);
// });


// (async() => {
//     const { postgreDatabase } = require('./tools/database');
//     try {
//     const results = await postgreDatabase.query("insert into user_table (user_name, organization, email, password, phone_number, user_type, photo_url, description) values (?, ?, ?, ?, ?, ?, ?, ?);", [
//       'omkaragrawal',
//       1,
//       'omkar@omkar.omkar',
//       'omkar',
//       '1234567890',
//       'student',
//       'https://google.com/imghp',
//       'No description provided'
//     ]);
//     console.log(results);
//   } catch(err) {
//     console.log(err);
//   } finally {
//     postgreDatabase.end();
//   }
// })()


(async () => {
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');
  const client = new MongoClient(process.env.MongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

  client.connect(async (err) => {
    assert.strictEqual(null, err);
  });
  const collection = client.db("Chats").collection("Chats");
  // perform actions on the collection object
  const reply = await collection.insertOne({
    "Name" : 'Trial Entry',
    "Value" : 'Chat System'
  });
  console.log(reply.insertedCount, reply.insertedId, reply.ops[0])

  const deleteReply = await collection.deleteOne({
    "_id": reply.insertedId
  });

  console.log(deleteReply.deletedCount);
  console.log(deleteReply.result);
  await client.close();

})()