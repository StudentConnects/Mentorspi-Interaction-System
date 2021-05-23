const express = require('express');
const path = require('path');
const router = express.Router();
const debug = require('debug')('abc:server:index.js');
const {checkSchema,validationResult} = require('express-validator')
// db functions
const db = require('../tools/database')

router.get("/", (req, res) => {
    debug("into /");
    console.log('into path');
    res.sendFile(path.join(__dirname, "..", "public", "sub-admin", "profile.html"));
});

router.all('/test', function (req, res) {
    debug("into /test");
    if (req.session.viewCount) {
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1;
    }
    res.send(`<h1>you visited ${req.session.viewCount}</h1>`);
});

router.get('/userdata',(req,res)=>{
    // console.log(req.user)
    // req.db
    //   .query('Select * from user where id = ?;', [req.user.id])
    db.getProfileData(req.user.id)
      .then((results) => {
        console.log(results.rows)
        res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

router.post('/updateuserdata',(req,res)=>{

    // console.log('here come')
    // console.log(req.body)
    // console.log(req.body.email)
    db.updateProfileData(req.body.phone_number, req.body.address, req.body.city, req.body.country, req.body.state, req.body.pincode, req.user.id)
      .then((results) => {
        console.log(results[0])
        res.redirect('/users/student')
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
    // res.redirect('/users/student')
});

router.get('/userlist',(req,res)=>{
  db.getOrgId(req.user.id)
    .then((result) => {
      orgID = result.rows[0].organization;
      db.getUserList(orgID)
      .then((results) => {
        console.log(results.rows)
        res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
    });
});

router.post('/userdata',(req,res)=>{
    db.getProfileData(req.body.id)
      .then((results) => {
        console.log(results.rows)
        res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

router.post('/updateusers',(req,res)=>{
    // db.updateUserData(req.body.name, req.body.email, req.body.password, req.body.mobile, req.body.org, req.body.add, req.body.city, req.body.postal, req.body.state, req.body.country, req.body.isActive, req.body.user_id)
    db.updateUserData(req.body.name, req.body.email, req.body.password, req.body.mobile, req.body.org, req.body.add, req.body.city, req.body.postal, req.body.state, req.body.country, req.body.user_id)
      .then((results) => {
        // res.redirect('/users/subAdmin')
        res.send(200);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

router.get('/orgdata', (req, res) => {
  db.getOrgId(req.user.id)
    .then((results) => {
        orgId = results.rows[0].organization;
        db.getOrgData(orgId)
          .then((result) => {
            res.send(result.rows)
          })
        // res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

router.post('/updateorgdata', (req, res) => {
  db.updateOrgData(req.body.name, req.body.mobile, req.body.email, req.body.address, req.body.orgId)
      .then((results) => {
        // res.redirect('/users/subAdmin')
        res.send(200);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
});

// router.post('/adduser',
//   checkSchema({
//       "userName": {
//           in: ["body"],
//           notEmpty: true,
//           isString: true,
//           trim: true,
//           isLength: {
//               options: {
//                   max: 50,
//                   min: 5
//               },
//               errorMessage: "Needs to be min: 5 Max 50"
//           }
//       },
//       "email": {
//           in: ["body"],
//           notEmpty: true,
//           isString: true,
//           trim: true,
//           normalizeEmail: true,
//           custom: {
//               options: (value, data) => {
//                   // console.table([{...data}]);
//                   return (new Promise((resolve, reject) => {
//                       // deepcode ignore javascript%2Fdc_interfile_project%2FEqualityMisplacedParentheses: <please specify a reason of ignoring this>
//                       if (data.location !== "body") {
//                           debug("Rejecting because not in body");
//                           reject("Invalid Request");
//                       } else {
//                           debug("Sending Request");
//                           emailVerifier("email", value).then(
//                               validated => {
//                                   debug("Remaining: " + validated.data.remaining_requests);
//                                   if (validated.data.status != 200) {
//                                       debug("Failed Status + " + JSON.stringify(validated.data));
//                                       reject("INVALID Email because of:\n" + JSON.stringify(validated.data));
//                                   } else if (validated.data.did_you_mean || validated.data.disposable || !validated.data.mx || !validated.valid() || !validated.successful()) {
//                                       // debug(validated.did_you_mean || validated.disposable || !validated.mx || !validated.valid() || !validated.successful())
//                                       const reason = "INVALID Email because of:\n" + JSON.stringify(validated.data) + "\n Valid: " + validated.valid() + "\n Successful: " + validated.successful();
//                                       debug("Rejecting Email in else if because of \n" + reason);
//                                       reject(reason);
//                                   } else {
//                                       debug("Resolving Request");
//                                       resolve(validated.email);
//                                   }
//                               }
//                           ).catch(
//                               err => {
//                                   debug(err);
//                                   reject("INVALID Email because of: \n" + err);
//                               }
//                           )
//                       }
//                   }));
//               }
//           },
//           isLength: {
//               options: {
//                   max: 50,
//                   min: 10
//               },
//               errorMessage: "Needs to be min: 10 Max 50"
//           }
//       },
//       "password": {
//           in: ["body"],
//           notEmpty: true,
//           isString: true,
//           trim: true,
//           isLength: {
//               options: {
//                   max: 50,
//                   min: 8
//               },
//               errorMessage: "Needs to be min: 8 Max: 50"
//           },
//           custom: {
//               options: (value, data) => {
//                   if (data.location != "body") {
//                       throw new Error("Invalid Request")
//                   } else if (RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.₹_\-]){8,}$/).test(value)) {
//                       return true
//                   } else {
//                       return Promise.reject("Password of min length 8 should contain at least 1 lowercase character, min of 1 UPPERCASE CHARACTER, a number and a special character");
//                   }
//               }
//           }
//       },
//       "institute_id": {
//           in: ["body"],
//           notEmpty: true,
//           // isString: true,
//           // isAlpha: true,
//           trim: true,
//           isLength: {
//               options: {
//                   max: 50,
//                   min: 1
//               },
//               errorMessage: "Needs to be min: 4 Max 50"
//           }
//       },
//       "mobile": {
//           in: ["body"],
//           errorMessage: "Invalid input for Mobile",
//           notEmpty: true,
//           trim: true,
//           isNumeric: true,
//           isInt: true,
//           isMobilePhone: {
//               locale: "en-IN"
//           },
//           toInt: true,
//       },
//       "address": {
//           in: ["body"],
//           notEmpty: true,
//           isString: true,
//           trim: true,
//           isLength: {
//               options: {
//                   max: 255,
//                   min: 5
//               },
//               errorMessage: "Needs to be min: 5 Max 255"
//           }
//       },
//       "city": {
//           in: ["body"],
//           notEmpty: true,
//           isString: true,
//           isAlpha: true,
//           trim: true,
//           isLength: {
//               options: {
//                   max: 15,
//                   min: 5
//               },
//               errorMessage: "Needs to be min: 5 Max 15"
//           }
//       },
//       "country": {
//           in: ["body"],
//           notEmpty: true,
//           isString: true,
//           trim: true,
//           isAlpha: true,
//           isLength: {
//               options: {
//                   max: 25,
//                   min: 5
//               },
//               errorMessage: "Needs to be min: 5 Max 25"
//           }
//       },
//       "postcode": {
//           in: ["body"],
//           errorMessage: "Invalid input for Postcode",
//           notEmpty: true,
//           trim: true,
//           isNumeric: true,
//           isInt: true,
//           isPostalCode: {
//               options: "IN"
//           },
//           toInt: true,
//       },
//   }), 
//     (req, res) => {
//       const results = validationResult(req)
//       if (!results.isEmpty()) {
//           debug(req.body);
//           res.status(400).json({
//               errors: results.array()
//           });
//       } else {
//           console.log(req.body)
//           if(req.body.isActive){
//               req.body.isActive == true
//           }else{
//               req.body.isActive == false
//           }
          
//           db.registerUser(req.body.userName, req.body.institute_id, req.body.email, req.body.password, req.body.mobile, req.body.address, req.body.city, req.body.country, req.body.state, req.body.postcode, 'www.google.com' ,'Decription not Provided','',false,req.body.isActive,req.body.user_type)
//           .then((data) =>{
//               console.log(data)
//               res.sendFile(path.join(__dirname, "..", "public", "super-admin", "users.html"));
//           }).catch((err)=>{
//               console.log(err)
//               if(err.code == '23505'){
//                   res.json({message:'User already Exists.'})
//               }else{
//                   res.send(err.detail);
//               }
//           })      
//       }
// });

router.delete('/disableUser', (req, res) =>{

});

module.exports = router;
