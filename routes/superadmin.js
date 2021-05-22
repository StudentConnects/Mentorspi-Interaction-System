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
    res.sendFile(path.join(__dirname, "..", "public", "superadmin", "profile.html"));
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
    console.log('entered in user data router')
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
})

module.exports = router;
