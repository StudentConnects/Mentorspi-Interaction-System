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

router.post('/specificuser',(req,res)=>{
    console.log('route hit')
    db.postgreDatabase.query('select * from user_table where id=$1',[req.body.id])
    .then((results) => {
        console.log(results.rows);
        console.log('data sent')
        res.send(results.rows[0]);
    }).catch(err=>{
        res.status(500).send(err)
    });
});

router.post('/updateuserdata',(req,res)=>{
    db.updateProfileData(req.body.phone_number, req.body.address, req.body.city, req.body.country, req.body.state, req.body.pincode, req.user.id)
      .then((results) => {
        console.log(results)
        res.sendFile(path.join(__dirname, "..", "public", "super-admin", "users.html"));
      })
      .catch((err) => {
        debug(err);
        res.status(500).send(err);
      });
    // res.redirect('/users/student')
});

router.post('/updatespecificuser',
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
    
}), (req, res) => {
    const results = validationResult(req)
    if (!results.isEmpty()) {
        debug(req.body);
        res.status(400).json({
            errors: results.array()
        });
    } else {
        console.log(req.body)
    //    res.send('data recieved')
        
        db.postgreDatabase.query('Update user_table set user_name=$1, organization=$2, email=$3, password=$4, phone_number=$5, user_type=$6, address=$7, city=$8, country=$9, state=$10, pincode=$11 where id=$12',[req.body.userName, req.body.institute_id, req.body.email, req.body.password, req.body.mobile,req.body.user_type, req.body.address, req.body.city, req.body.country, req.body.state, req.body.postcode,req.body.id])
        .then((data) =>{
            console.log(data)
            console.log('data updated')
            res.sendFile(path.join(__dirname, "..", "public", "super-admin", "users.html"));
        }).catch((err)=>{
            console.log(err)
                res.send(err.detail);
        })
    }
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
    }).catch(err=>{
        res.status(500).send(err)
    });
});

router.post('/getOrgdata',(req,res)=>{
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
        }
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
            }
});

router.get('/activeuserlist',(req,res)=>{
    db.postgreDatabase.query('select * from user_table where isactive = true')
    .then((results)=>{
        // console.log(results.rows);
        res.send(results.rows);
    }).catch(err=>{
        console.log(err);
        res.status(500).send(err);
    })
});

router.get('/inactiveuserlist',(req,res)=>{
    db.postgreDatabase.query('select * from user_table where isactive = false')
    .then((results)=>{
        // console.log(results.rows);
        res.send(results.rows);
    }).catch(err=>{
        console.log(err);
        res.status(500).send(err);
    })
})

router.delete("/disableuser",
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
    .query("update user_table set isactive = false where id = $1", [id])
    .then((results) => {
      console.log(results);
      res.send(results[0]);
    }).catch(err=>{
        res.status(500).send(err)
    })
});
  
router.patch("/enableuser",
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
    .query("update user_table set isactive = true where id = $1", [id])
    .then((results) => {
      console.log(results);
      res.send(results[0]);
    }).catch(err=>{
        res.status(500).send(err)
    });
});


module.exports = router;
