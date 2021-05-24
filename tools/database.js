/* eslint-disable node/no-unpublished-require */
const redis = require('ioredis');
const {
    Pool
} = require('pg');
const MongoClient = require('mongodb').MongoClient;


let postgreDatabase;
if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-unused-vars 
    const dotenv = require("dotenv").config();
    postgreDatabase = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    postgreDatabase = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20
    });
}

const redisDatabase = new redis(process.env.STACKHERO_REDIS_URL_TLS);
let mongoClient = new MongoClient(process.env.MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 490,
    minPoolSize: 5
});

(async () => {
    await mongoClient.connect();
})();

/**
 * @param  {String} userName - Username of the user
 * @param  {Number} organization - The organization that user registers for
 * @param  {String} email - Email ID entered by the user
 * @param  {String} password - Password entered by the user
 * @param  {String} phoneNumber - Phone number entered by the user
 * @param  {String} address - Address of residence of the user
 * @param  {String} city - City of residence of the user
 * @param  {String} country - Country of residence of the user
 * @param  {String} state - State of residence of the user
 * @param  {Number} pinCode - Pin code of residence of the user
 * @param  {String} [photoUrl=''] - User Photo URL, default photo provided
 * @param  {String} [description='No description provided'] - Description provided by the user, default description given
 * @param  {String} [googleId=''] - GoogleID of the user can be Empty
 * @param  {Boolean} [isVerified=false] - Is user verified? Default to false
 * @param  {Boolean} [isActive=false] - Is user allowed to access the system? Default to false
 * @param  {'student' | 'mentor' | 'subAdmin' | 'superAdmin'} userType - UserType of the user (for future use) current default to student
 * @returns {Promise} promise
 */
const registerUser = (userName, organization, email, password, phoneNumber, address, city, country, state, pinCode, photoUrl = '', description = 'No description provided', googleId = '', isVerified = false, isActive = false, userType = 'student') => {

    let query = 'insert into user_table (';
    let queryValues = ' values (';
    let count = 0;
    let values = [];
    if (googleId) {
        query += 'google_id';
        count++
        queryValues += `$${count}`;
        values.push(googleId);
    }

    if (userName) {
        query += (googleId) ? ', user_name' : 'user_name';
        count++
        queryValues += (googleId) ? `, $${count}` : `$${count}`;
        values.push(userName);
    } else {
        return (Promise.reject(new Error('User Name not provided'), null));
    }
    // if (userName) {
    //     query += ', user_name' ;
    //     count++
    //     queryValues +=  `$${count}`;
    //     values.push(userName);
    // } else {
    //     return (Promise.reject(new Error('User Name not provided'), null));
    // }

    if (organization) {
        query += ', organization';
        count++
        queryValues += `, $${count}`;
        values.push(organization);
    }

    if (email) {
        query += ', email';
        count++
        queryValues += `, $${count}`;
        values.push(email);
    } else {
        return (Promise.reject(new Error('Email not provided'), null));
    }

    if (password) {
        query += ', password';
        count++
        queryValues += `, $${count}`;
        values.push(password);
    } else {
        return (Promise.reject(new Error('Password not provided'), null));
    }

    if (phoneNumber) {
        query += ', phone_number';
        count++
        queryValues += `, $${count}`;
        values.push(phoneNumber);
    } else {
        return (Promise.reject(new Error('Phone Number not provided'), null));
    }

    if (address) {
        query += ', address';
        count++
        queryValues += `, $${count}`;
        values.push(address);
    } else {
        return (Promise.reject(new Error('Address not provided'), null));
    }

    if (city) {
        query += ', city';
        count++
        queryValues += `, $${count}`;
        values.push(city);
    } else {
        return (Promise.reject(new Error('City not provided'), null));
    }

    if (country) {
        query += ', country';
        count++
        queryValues += `, $${count}`;
        values.push(country);
    } else {
        return (Promise.reject(new Error('Country not provided'), null));
    }

    if (state) {
        query += ', state';
        count++
        queryValues += `, $${count}`;
        values.push(state);
    } else {
        return (Promise.reject(new Error('State not provided'), null));
    }

    if (pinCode > 0) {
        query += ', pincode';
        count++
        queryValues += `, $${count}`;
        values.push(pinCode);
    } else {
        return (Promise.reject(new Error('Invalid Pin Code'), null));
    }

    if (userType) {
        query += ', user_type';
        count++
        queryValues += `, $${count}`;
        values.push(userType);
    } else {
        query += ', userType';
        count++
        queryValues += `, $${count}`;
        values.push('student');
    }

    if (photoUrl) {
        query += ', photo_url';
        count++
        queryValues += `, $${count}`;
        values.push(photoUrl);
    }

    if (description) {
        query += ', description';
        count++
        queryValues += `, $${count}`;
        values.push(description);
    } else {
        return (Promise.reject(new Error('Description not provided'), null));
    }

    if (isVerified) {
        query += ', isVerified';
        count++
        queryValues += `, $${count}`;
        values.push(isVerified);
    }

    if (isActive) {
        query += ', isActive';
        count++
        queryValues += `, $${count}`;
        values.push(isActive);
    }

    query += ')';
    queryValues += ') returning *;';
    query += queryValues;
    return (postgreDatabase.query(query, values));
};

/**
 * @param  {String} userEmail - The email to get login details
 * @returns {Promise} promise
 */
const loginUser = (userEmail) => {
    if (!userEmail) {
        return (Promise.reject(new Error('No Email Provided')));
    }
    return (postgreDatabase.query('Select user_table.*, o."subscriptionleft" as "orgSubscription", o.name as "orgName", o."isactive" as "orgIsActive", o."isverified" as "orgIsVerified" from user_table inner join organisations o on user_table.organization = o.id  where user_table.email =$1', [userEmail]));
};

/**
 * @typedef Response
 *  @property {Object} executionResponse - Response received after executing the Query in database
 */

/**
 * @param  {String} orgName - Organization's Name
 * @param  {String} address - Organization's Address
 * @param  {String} orgAdmin - Organization Admin user email
 * @param  {String} contactEmail - Organization Contact Email
 * @param  {String} contactPhone - Organization Contact Phone
 * @param  {Number} [subscriptionLeft=0] - Subscription time for the Organization
 * @param  {URL} [photoUrl="https://google.com/imghp"] - URL of the photo to be used as profile picture
 * @param  {Boolean} [isVerified= false] - Is organization Verified by defaults to false
 * @param  {Boolean} [isActive= false] - Set organization Active defaults to false
 * @returns {Promise<Response>} - Returns a Promise with the executed state
 */
const registerCompany = (orgName, Address, orgAdmin, contactEmail, contactPhone, subscriptionLeft = 0, photoUrl = "https://google.com/imghp", isVerified = false, isActive = false) => {
    if (!orgName) {
        return (Promise.reject(new Error('Organization Name not supplied')));
    }

    if (!Address) {
        return (Promise.reject(new Error('Address not supplied')));
    }

    if (!orgAdmin) {
        return (Promise.reject(new Error('Organization Admin not set')));
    }

    if (!contactEmail) {
        return (new Error('Contact Email not provided'));
    }

    if (!contactPhone) {
        return (new Error('Contact Phone not provided'));
    }

    if (subscriptionLeft < 0) {
        return (new Error('Invalid Subscription provided'));
    }

    // return (postgreDatabase.query("insert into organisations (name, address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive) values ($1, $2, (Select id from user_table where email = $3), $4, $5, $6, $7, $8, $9) and update user_table set user_type='subAdmin' where email=$3 returning *;", [orgName, Address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive]))
    // return (postgreDatabase.query("insert into organisations (name, address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive) values ($1, $2, (Select id from user_table where email = $3), $4, $5, $6, $7, $8, $9)", [orgName, Address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive]))
    return postgreDatabase.query("insert into organisations (name, address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive) values ($1, $2, (Select id from user_table where email = $3), $4, $5, $6, $7, $8, $9) returning *;", [orgName, Address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive])
    .then((results)=>{
        if(results.rows){
            // console.log(results.rows)
            return postgreDatabase.query("update user_table set user_type='subAdmin',organization=$2 where email=$1;",[orgAdmin,results.rows[0].id])
        }else{
            console.log(results);
            return Promise.reject('Invalid response');
        }
    }).catch(err=>{
        console.log(err);
        return Promise.reject(err);
    })

   };


/**
 * @param  {Number} accountId - Account id that will get affected.
 * @param  {"user" | "company"} [accountType='user'] - Set the Type of account. Defaults to user. Another accountType option is company.
 * @param  {Boolean} [setActive=true] - Set to true if the profile has to be activated, else set to false. Defaults to true.
 * @returns {Promise<Response>} - Returns a Promise with the executed state
 */
const setAccountActivation = (accountId, accountType = 'user', setActive = true) => {
    if (accountId) {
        if (accountType === 'user') {
            return (postgreDatabase.query('UPDATE user_table SET "isActive" = $1 WHERE id = $2;', [setActive, accountId]));
        } else if (accountType === 'company') {
            return (postgreDatabase.query('UPDATE organisations SET "isActive" = $1 WHERE id = $2;', [setActive, accountId]));
        } else {
            return (Promise.reject('Invalid Account type provided'));
        }
    } else {
        return (Promise.reject('ID for the account not provided'));
    }
};

/**
 * @param {Number} id - User id for which the profile details has to be retrieved
 * @returns {Promise} Promise
 */
const getProfileData = (id) => {
    if(id) {
        return(postgreDatabase.query('Select user_name, organization, email, phone_number, photo_url, description, address, city, country, state, pincode from user_table where id = $1', [id]));
    } 
    return(Promise.reject('Invalid User id'));
} 


        // User Data Update Created.
/**
 * @param  {Number} id - User id as per stored in PostgresDatabase
 * @param  {String} phoneNumber - Phone number entered by the user
 * @param  {String} address - Address of residence of the user
 * @param  {String} city - City of residence of the user
 * @param  {String} country - Country of residence of the user
 * @param  {String} state - State of residence of the user
 * @param  {Number} pinCode - Pin code of residence of the user
 * @param  {String} [description='No description provided'] - Description provided by the user, default description given
 * @returns {Promise} promise
 */

 const updateProfileData = (phone_number, address, city, country, state, pincode, id) => {
    if(id) {
        return(postgreDatabase.query('Update user_table SET "phone_number"=$1, "address"=$2, "city"=$3, "country"=$4, "state"=$5, "pincode"=$6 where id = $7', [phone_number, address, city, country, state, pincode,id]));
    } 
    return(Promise.reject('Invalid User id'));
} 

/**
 * @param {Number} user_id - User id for which the OrgID has to be retrieved
 * @returns {Promise} Promise
 */
const getOrgId = (user_id) => {
    if(user_id) {
        return(postgreDatabase.query('select organization from user_table where id=$1', [user_id]));
    } 
    return(Promise.reject('Invalid User id'));
} 

/**
 * @param {Number} id - Organisation id for which the user list has to be retrieved
 * @returns {Promise} Promise
 */
const getUserList = (id) => {
    if(id) {
        return(postgreDatabase.query('Select id, user_name, organization, email, phone_number, photo_url, description, address, city, country, state, pincode, user_type from user_table where organization = $1', [id]));
    } 
    return(Promise.reject('Invalid Organization id'));
} 

// User Data Update from sub-admin dashboard.
/**
 * @param  {Number} user_id - User id as per stored in PostgresDatabase
 * @param  {String} phoneNumber - Phone number entered by the user
 * @param  {String} address - Address of residence of the user
 * @param  {String} city - City of residence of the user
 * @param  {String} country - Country of residence of the user
 * @param  {String} state - State of residence of the user
 * @param  {Number} pinCode - Pin code of residence of the user
 * @param  {String} [description='No description provided'] - Description provided by the user, default description given
 * @returns {Promise} promise
 */

 const updateUserData = (name, email, password, mobile, org, add, city, postal, state, country, user_type, user_id) => {
    if(user_id) {
        return(postgreDatabase.query('Update user_table SET "user_name"=$1 ,"email"=$2, "password"=$3, "phone_number"=$4, "organization"=$5, "address"=$6, "city"=$7, "pincode"=$8, "state"=$9, "country"=$10, "user_type"=$11 where id = $12', [name, email, password, mobile, org, add, city, postal, state, country, user_type, user_id]));
    } 
    return(Promise.reject('Invalid User id'));
} 


/**
 * @param {Number} orgId - Organization id for which the profile details has to be retrieved
 * @returns {Promise} Promise
 */
const getOrgData = (orgId) => {
    if(orgId) {
        return(postgreDatabase.query('Select id, name, orgadmin, contactemail, contactphone, address from organisations where id = $1', [orgId]));
    } 
    return(Promise.reject('Invalid Org id'));
} 

/**
 * @param  {Number} user_id - User id as per stored in PostgresDatabase
 * @param  {String} phoneNumber - Phone number entered by the user
 * @param  {String} address - Address of residence of the user
 * @param  {String} city - City of residence of the user
 * @param  {String} country - Country of residence of the user
 * @param  {String} state - State of residence of the user
 * @param  {Number} pinCode - Pin code of residence of the user
 * @param  {String} [description='No description provided'] - Description provided by the user, default description given
 * @returns {Promise} promise
 */

 const updateOrgData = (name, contactphone, contactemail, address, orgId) => {
    if(orgId) {
        return(postgreDatabase.query('Update organisations SET "name"=$1 ,"contactphone"=$2, "contactemail"=$3, "address"=$4 where id = $5', [name, contactphone, contactemail, address, orgId]));
    } 
    return(Promise.reject('Invalid Organization id'));
}

module.exports = {
    postgreDatabase,
    mongoClient,
    redisDatabase,
    registerCompany,
    registerUser,
    loginUser,
    setAccountActivation,
    getProfileData,
    updateProfileData,
    getUserList,
    getOrgId,
    updateUserData,
    getOrgData,
    updateOrgData

}

