if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv").config()
}

// const {
//   expect
// } = require("chai");

// (async () => {
// const Ioredis = require('ioredis');
// const {
//   post
// } = require("./server");

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


// (async () => {
//   const {
//     chatDatabase,
//     mongoClient
//   } = require('./tools/database');

//   const collection = await (await chatDatabase).collection('Chats');

//   const reply = await collection.insertOne({
//     "Name": 'Trial Entry',
//     "Value": 'Chat System'
//   });
//   console.log(reply.insertedCount, reply.insertedId, reply.ops[0])

//   const deleteReply = await collection.deleteOne({
//     "_id": reply.insertedId
//   });

//   console.log(await deleteReply.deletedCount);
//   console.log(await deleteReply.result);
//   try {
//     console.log(await mongoClient.isConnected());
//     const close = await mongoClient.close();
//     console.log(await mongoClient.isConnected());
//     console.log(await close);
//   } catch (error) {
//     console.log(error);
//   }

// })();

// (async () => {
//   const {
//     postgreDatabase,
//     setAccountActivation
//   } = require('./tools/database');
//   const reply = await setAccountActivation(1, "user", true);
//   console.log(await reply);
//   await postgreDatabase.end();
// })();

    // User Login

// (async () => {
//   const {
//     loginUser  } = require('./tools/database');
//     console.log(await loginUser('andharikar@gmail.com'))
//   })();

// (async () => {
//   const {
//     postgreDatabase,
//     registerCompany
//   } = require('./tools/database');
//   const results = await postgreDatabase.query("select * from organisations");
//   console.log(await results.rows);
//   await postgreDatabase.end();
// })();

    // Query pool for all users

  // (async () => {
  //   const {postgreDatabase:pool} = require('./tools/database');
  //   // await pool.query('Update user_table SET "isActive"=$1 where id=$2', ['false', 15]);
  //   const result =  await pool.query('select organization from user_table where id=$1', [20]);
  //   console.log(result.rows)
  //   })();
  
      // Query all organizations

  // (async () => {
  //   const {postgreDatabase:pool} = require('./tools/database');
  //   const result =  await pool.query('Select * from organisations')
  //   console.log(result.rows)
  //   })();
      // Register a mentor

  //   (async () => {
  // const { registerUser  } = require('./tools/database');
  //   const result =await registerUser('mentor', 1,'mentor@gmail.com', 'Pass@123', 9876543210, 'address', 'city', 'country', 'state', 431003, 'www.google.com', 'No description provided', '', false, false, 'mentor')
  //   console.log(result.rows)
  // })();

  // Register a subAdmin

  //   (async () => {
  // const { registerUser } = require('./tools/database');
  //   const result =await registerUser('student3', 1,'student3@gmail.com', 'Pass@1234', 9876543222, 'address', 'city', 'country', 'state', 431003, 'www.google.com', 'No description provided', '', false, true, 'student')
  //   console.log(result.rows)
  // })();


  //

  // (async () => {
  //   try{
  //   const { registerCompany } = require('./tools/database');
  //     const result =await registerCompany('student3','address','studentgmail.com','stud@company.com', '9876543222',0, 'www.google.com',false,true)
  //     console.log(await result.rows)
  //   }
  //   catch(err){
  //     console.log(err)
  //   }
  //   })();

  // (async ()=>{
  //   const {postgreDatabase} = require('./tools/database')
  //   const result = await postgreDatabase.query('select * from organisations')
  //   console.log(await result.rows)
  // })();

  //  (async ()=>{
  //   const {postgreDatabase} = require('./tools/database')
  //   const result = await postgreDatabase.query('select * from user_table')
  //   console.log(await result.rows)
  // })();
//   var a = 'sitfndsfjjfhf'
//   console.log(`${a}`+' hdshfsdbffsdff')
// (async () => {
//   const {
//     postgreDatabase,
//     getOrgId
//   } = require('./tools/database');
//   const results = await getOrgId(20);
//   console.log(await results.rows);
//   await postgreDatabase.end();
// })();  
