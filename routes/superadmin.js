const express = require('express');
const path = require('path');
const router = express.Router();
const debug = require('debug')('abc:server:index.js');
const {checkSchema,validationResult} = require('express-validator')
// db functions
const db = require('../tools/database')
const ValidatorPizzaClient = require("validator-pizza-node");
const { Router } = require('express');
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

  router.delete("/disableCompany",
  checkSchema({
    id: {
      in: ["body"],
      errorMessage: 'ID is wrong',
      isInt: true,
      toInt: true,
    }
  }),
 (req, res) => {
  const { id } = req.body;
  db.postgreDatabase
    .query("update organisations set isactive = false where id = $1", [id])
    .then((results) => {
      console.log(results);
      res.send(results[0]);
    //   let info = results[0].info.split(":");
    //   if (info[1].includes("0") || info[2].includes("0")) {
    //     console.log("INCORRECT ID");
    //     console.log(results);
    //     res.send("Incorrect ID");
    //   } else if (info[1].includes("1") && info[2].includes("1")) {
    //     res.send("Success");
    //   } else {
    //     console.log(info);
    //     res.status(500).send(results.info);
    //   }
    }).catch(err=>{
        res.status(500).send(err)
    })
});
  
router.patch("/enableCompany",
checkSchema({
    id: {
      in: ["body"],
      errorMessage: 'ID is wrong',
      isInt: true,
      toInt: true,
    }
  }),
  (req, res) => {
  const { id } = req.body;
  db.postgreDatabase
    .query("update organisations set isactive = true where id = $1", [id])
    .then((results) => {
      console.log(results);
      res.send(results[0]);
    //   let info = results[0].info.split(":");
    //   if (info[1].includes("0") || info[2].includes("0")) {
    //     console.log("INCORRECT ID");
    //     console.log(results);
    //     res.send("Incorrect ID");
    //   } else if (info[1].includes("1") && info[2].includes("1")) {
    //     res.send("Success");
    //   } else {
    //     console.log(info);
    //     res.status(500).send(results.info);
    //   }
    }).catch(err=>{
        res.status(500).send(err)
    });
});

router.post('/getOrgdata',(req,res,next)=>{
    db.postgreDatabase.query('select * from organisations where id=$1',[req.body.id])
    .then((results) => {
        console.log(results.rows);
        res.send(results.rows[0]);
    }).catch(err=>{
        res.status(500).send(err)
    });
})

router.post('/editOrgdata',
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
            trim: true,
            isLength: {
                options: {
                    max: 50,
                    min: 1
                },
                errorMessage: "Needs to be min: 1 Max 50"
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
            console.log(req.body)
            // res.send('data received')
                db.postgreDatabase.query('update organisations set name=$1 ,address=$2 ,contactemail=$3,contactphone=$4 where id = $5',[req.body.company_name, req.body.company_address, req.body.company_email, req.body.company_phone,req.body.id])
                .then((_) =>{
                    // console.log(data)
                    res.send('Company edited successfully.');
                }).catch((err)=>{
                    console.log(err)
                        res.status(500).send(err)
                });
            }
        });

        router.post('/register',
        checkSchema({
            "userName": {
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
            "email": {
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
            "password": {
                in: ["body"],
                notEmpty: true,
                isString: true,
                trim: true,
                isLength: {
                    options: {
                        max: 50,
                        min: 8
                    },
                    errorMessage: "Needs to be min: 8 Max: 50"
                },
                custom: {
                    options: (value, data) => {
                        if (data.location != "body") {
                            throw new Error("Invalid Request")
                        } else if (RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.₹_\-]){8,}$/).test(value)) {
                            return true
                        } else {
                            return Promise.reject("Password of min length 8 should contain at least 1 lowercase character, min of 1 UPPERCASE CHARACTER, a number and a special character");
                        }
                    }
                }
            },
            "institute_id": {
                in: ["body"],
                notEmpty: true,
                // isString: true,
                // isAlpha: true,
                trim: true,
                isLength: {
                    options: {
                        max: 50,
                        min: 1
                    },
                    errorMessage: "Needs to be min: 4 Max 50"
                }
            },
            "mobile": {
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
            "address": {
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
            "city": {
                in: ["body"],
                notEmpty: true,
                isString: true,
                isAlpha: true,
                trim: true,
                isLength: {
                    options: {
                        max: 15,
                        min: 5
                    },
                    errorMessage: "Needs to be min: 5 Max 15"
                }
            },
            "country": {
                in: ["body"],
                notEmpty: true,
                isString: true,
                trim: true,
                isAlpha: true,
                isLength: {
                    options: {
                        max: 25,
                        min: 5
                    },
                    errorMessage: "Needs to be min: 5 Max 25"
                }
            },
            "postcode": {
                in: ["body"],
                errorMessage: "Invalid input for Postcode",
                notEmpty: true,
                trim: true,
                isNumeric: true,
                isInt: true,
                isPostalCode: {
                    options: "IN"
                },
                toInt: true,
            },
            // "photo": {
            //     in: ["body"],
            //     notEmpty: true,
            //     isString: true,
            //     trim: true,
            //     isURL: true,
            //     isLength: {
            //         options: {
            //             max: 325,
            //             min: 11
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
                console.log(req.body)
                if(req.body.isActive){
                    req.body.isActive == true
                }else{
                    req.body.isActive == false
                }
                
                db.registerUser(req.body.userName, req.body.institute_id, req.body.email, req.body.password, req.body.mobile, req.body.address, req.body.city, req.body.country, req.body.state, req.body.postcode, 'www.google.com' ,'Decription not Provided','',false,req.body.isActive,req.body.user_type)
                .then((data) =>{
                    console.log(data)
                    res.sendFile(path.join(__dirname, "..", "public", "super-admin", "users.html"));
                }).catch((err)=>{
                    console.log(err)
                    if(err.code == '23505'){
                        res.json({message:'User already Exists.'})
                    }else{
                        res.send(err.detail);
                    }
                })
    
    
                // const verificationID = nanoid();
                // console.table([{
                //     ...req.body
                // }]);
                
                // debug("Received at /register");
                // req.db.query("CALL Reg(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [req.body.email, req.body.password, req.body.fullname, req.body.mobile, req.body.address, req.body.city, req.body.country, req.body.postcode, req.body.institute_name, req.body.photo, verificationID])
                //     .then((...results) => {
                //         const data = results[0][0][0];
                //         console.log(...results);
                //         console.table([{
                //             id: data.id,
                //             email: data.email,
                //             status: data["@status"],
                //             isVerified: data.isVerified
                //         }]);
                //         // res.json(req.body);
                //         // res.redirect("/registrationSuccess")
                //         // debug("Response Sent successfully");
                //         // res.send("Registration Successful");
    
                //         return sendVerificationMail(req.body.email, verificationID);
                //     })
                //     .then(results => {
                //         if (results[0].statusCode == 202) {
                //             debug("sent code:  " + verificationID);
                //             res.send("<h1>SUCCESSFULLY REGISTERED Please verify from your mail</h1>");
                //         } else throw results;
                //     })
                //     .catch((err) => {
                //         debug(err);
                //         res.json({
                //             body: req.body,
                //             error: err
                //         });
                //         debug("Response Sent with error");
                //     });
    
                // res.json(req.body);
            }
    });

router.get('/activeuserlist',(req,res)=>{
    db.postgreDatabase.query('select * from user_table where isactive = true')
    .then((results)=>{
        console.log(results.rows);
        res.send(results.rows);
    }).catch(err=>{
        console.log(err);
        res.status(500).send(err);
    })
});

router.get('/inactiveuserlist',(req,res)=>{
    db.postgreDatabase.query('select * from user_table where isactive = false')
    .then((results)=>{
        console.log(results.rows);
        res.send(results.rows);
    }).catch(err=>{
        console.log(err);
        res.status(500).send(err);
    })
})

module.exports = router;
