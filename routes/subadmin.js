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
    db.updateProfileData(req.body.phone_number, req.body.address, req.body.city, req.body.country, '', req.body.pincode, req.user.id)
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

router.delete('/disableUser', (req, res) =>{

});

module.exports = router;
