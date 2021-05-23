const express = require('express');
const path = require('path');
const router = express.Router();
const debug = require('debug')('abc:server:index.js');
const {checkSchema,validationResult} = require('express-validator')
// db functions
const db = require('../tools/database')
const ValidatorPizzaClient = require("validator-pizza-node");
const emailVerifier = new ValidatorPizzaClient().validate;
router.get("/", (req, res) => {
    debug("into /");
    console.log('into path');
    res.sendFile(path.join(__dirname, "..", "public", "super-admin", "profile.html"));
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

router.post('/addCompany',
    checkSchema({
        "company_name": {
            in: ["body"],
            notEmpty: true,
            isString: true,
            trim: true,
            isLength: {
                options: {
                    max: 50,
                    min: 5
                },
                errorMessage: "Needs to be min: 5 Max 50"
            }
        },
        "contact_person": {
            in: ["body"],
            notEmpty: true,
            isString: true,
            trim: true,
            isLength: {
                options: {
                    max: 50,
                    min: 5
                },
                errorMessage: "Needs to be min: 5 Max 50"
            }
        },
        "company_email": {
            in: ["body"],
            notEmpty: true,
            isString: true,
            trim: true,
            normalizeEmail: true,
            custom: {
                options: (value, data) => {
                    // console.table([{...data}]);
                    return (new Promise((resolve, reject) => {
                        // deepcode ignore javascript%2Fdc_interfile_project%2FEqualityMisplacedParentheses: <please specify a reason of ignoring this>
                        if (data.location !== "body") {
                            debug("Rejecting because not in body");
                            reject("Invalid Request");
                        } else {
                            debug("Sending Request");
                            emailVerifier("email", value).then(
                                validated => {
                                    debug("Remaining: " + validated.data.remaining_requests);
                                    if (validated.data.status != 200) {
                                        debug("Failed Status + " + JSON.stringify(validated.data));
                                        reject("INVALID Email because of:\n" + JSON.stringify(validated.data));
                                    } else if (validated.data.did_you_mean || validated.data.disposable || !validated.data.mx || !validated.valid() || !validated.successful()) {
                                        // debug(validated.did_you_mean || validated.disposable || !validated.mx || !validated.valid() || !validated.successful())
                                        const reason = "INVALID Email because of:\n" + JSON.stringify(validated.data) + "\n Valid: " + validated.valid() + "\n Successful: " + validated.successful();
                                        debug("Rejecting Email in else if because of \n" + reason);
                                        reject(reason);
                                    } else {
                                        debug("Resolving Request");
                                        resolve(validated.email);
                                    }
                                }
                            ).catch(
                                err => {
                                    debug(err);
                                    reject("INVALID Email because of: \n" + err);
                                }
                            )
                        }
                    }));
                }
            },
            isLength: {
                options: {
                    max: 50,
                    min: 10
                },
                errorMessage: "Needs to be min: 10 Max 50"
            }
        },
        "company_phone": {
            in: ["body"],
            errorMessage: "Invalid input for Mobile",
            notEmpty: true,
            trim: true,
            isNumeric: true,
            isInt: true,
            isMobilePhone: {
                locale: "en-IN"
            },
            toInt: true,
        },
        "company_address": {
            in: ["body"],
            notEmpty: true,
            isString: true,
            trim: true,
            isLength: {
                options: {
                    max: 255,
                    min: 5
                },
                errorMessage: "Needs to be min: 5 Max 255"
            }
        },
        // "logo": {
        //     in: ["body"],
        //     isString: true,
        //     trim: true,
        //     isLength: {
        //         options: {
        //             max: 5000,
        //             min: 0
        //         },
        //         errorMessage: "Needs to be min: 11 Max 325"
        //     }
        // }
    }), (req, res) => {
        const results = validationResult(req)
        if (!results.isEmpty()) {
            debug(req.body);
            res.status(400).json({
                errors: results.array()
            });
        } else {
            console.log("COMPANY DATA ------- ",req.body)

            db.registerCompany(req.body.company_name, req.body.company_address, req.body.contact_person, req.body.company_email, req.body.company_phone,0,req.body.company_logo,true,req.body.isActive)
            .then((_) =>{
                // console.log(data)
                res.send('Company added successfully.');
            }).catch((err)=>{
                console.log(err)
                if(err.code == '23505'){
                    res.send('Company already exists.')
                }else{
                    res.status(500).send(err)
                }
            })
        }
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
})

router.get("/listActiveCompanies", (req, res) => {
    db.postgreDatabase.query("Select * from organisations where isactive = true;")
      .then((results) => {
        res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
  });
  
  router.get("/listInactiveCompanies", (req, res) => {
    db.postgreDatabase.query("Select * from organisations where isactive = false;")
      .then((results) => {
        res.send(results.rows);
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
  });


  
module.exports = router;
