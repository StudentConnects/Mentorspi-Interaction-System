const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const router = express.Router();
const debug = require('debug')('abc:server:index.js');
// debug("Into Index File");
const studentRouter = require('./student');
const mentorRouter = require('./mentor');
const subadminRouter = require('./subadmin');
const superadminRouter = require('./superadmin');

router.all("/", (_req, res) => {
    debug("into /");
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
router.all('/test', function (_req, res) {
    debug("into /test");
    res.send("TEST SUCCESS");
});
router.get('/verify', (req, res) => {
    const verificationID = req.query.code;
    const email = req.query.refs;
    req.db.query('update user set isVerified = TRUE, verificationCode = NULL where verificationCode = ?;', [verificationID])
    .then((results) => {
      if(results[0].changedRows===1) {
        res.send("<h1>SUCCESSFULLY Verified</h1>")
      } else {
        res.send("<h1>INVALID Verification</h1>");
      }
    })
    .catch((err) => {
      console.log(err);
    });
})

// router.use("/assets", express.static(path.join(__dirname, "..", "public", "assets")));
router.use("/admin", express.static(path.join(__dirname, "..", "public", "subadmin")))
router.use("/super-admin", express.static(path.join(__dirname, "..", "public", "superadmin")))
router.use("/mentor", express.static(path.join(__dirname, "..", "public", "mentor")))
router.use("/student", express.static(path.join(__dirname, "..", "public", "student")))

function checkLogin(req, res, next) {
  console.log(req.user)
    if(req.user.user_type === req.allowedUserType) {
            next();
        }else if (req.user.user_type && req.user.user_type  !==  req.allowedUserType) {
          res.redirect(301, `/users/${req.user.user_type}`)
        }else{
          res.redirect('/login')
        }
    // } else {
    //     console.warn("in secured in not authenticated");
    //     res.redirect("/login");
    // }
}
// router.use('/admin', (req, _, next) => {req.allowedUserType = "admin"; req.differentUserType = "student"; next();}, checkLogin, adminRouter);
// router.use('/student', (req, _, next) => {req.allowedUserType = "student"; req.differentUserType = "admin"; next();}, checkLogin, studentRouter);

router.use('/super-admin',(req, _, next) => {req.allowedUserType = "superAdmin";next();},checkLogin,superadminRouter)
router.use('/admin',(req, _, next) => {req.allowedUserType = "subAdmin";next();},checkLogin, subadminRouter);
router.use('/mentor',(req, _, next) => {req.allowedUserType = "mentor";next();},checkLogin,mentorRouter)
router.use('/student',(req, _, next) => {req.allowedUserType = "student";next();},checkLogin, studentRouter);

module.exports = router;
