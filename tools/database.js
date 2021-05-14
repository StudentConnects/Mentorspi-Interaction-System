/* eslint-disable node/no-unpublished-require */
const redis = require('ioredis');
const {
    Pool
} = require('pg');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


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
const client = new MongoClient(process.env.MongoURL);
/**
 * @param  {String} userName Username of the user
 * @param  {Number} organization The organization that user registers for
 * @param  {String} email Email ID entered by the user
 * @param  {String} password Password entered by the user
 * @param  {String} phoneNumber Phone number entered by the user
 * @param  {String} photoUrl='' User Photo URL, default photo provided
 * @param  {String} description='No description provided' Description provided by the user, default description given
 * @param  {String} googleId='' GoogleID of the user can be Empty
 * @param  {Boolean} isVerified=false Is user verified? Default to false
 * @param  {Boolean} isActive=false Is user allowed to access the system? Default to false
 * @param  {'student' | 'mentor' | 'subAdmin' | 'superAdmin'} userType UserType of the user (for future use) current default to student
 * @returns {Promise} promise
 */
const registerUser = (userName, organization, email, password, phoneNumber, photoUrl = '', description = 'No description provided', googleId = '', isVerified = false, isActive = false, userType = 'student') => {

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
 * @param  {String} userEmail The email to get login details
 * @returns {Promise} promise
 */
const loginUser = (userEmail) => {
    if (!userEmail) {
        return (Promise.reject(new Error('Now Email Provided')));
    }
    return (postgreDatabase.query('Select user_table.*, o."subscriptionLeft" as "orgSubscription", o.name as "orgName", o."isActive" as "orgIsActive", o."isVerified" as "orgIsVerified" from user_table inner join organisations o on user_table.organization = o.id  where user_table.email =$1', [userEmail]));
};

/**
 * @param  {String} orgName Organization's Name
 * @param  {String} address Organization's Address
 * @param  {Number} orgAdmin Organization Admin user ID
 * @param  {String} contactEmail Organization Contact Email
 * @param  {String} contactPhone Organization Contact Phone
 * @param  {Number} subscriptionLeft Subscription time for the Organization
 * @param  {URL} photoUrl="https://google.com/imghp"
 * @param  {Boolean} isVerified=false Is organization Verified by defaults to false
 * @param  {Boolean} isActive=false Set organization Active defaults to false
 */
const registerCompany = (orgName, address, orgAdmin, contactEmail, contactPhone, subscriptionLeft = 0, photoUrl = "https://google.com/imghp", isVerified = false, isActive = false) => {
    if(!orgName) {
        return(Promise.reject(new Error('Organization Name not supplied')));
    }

    if(!address) {
        return(Promise.reject(new Error('Address not supplied')));
    }

    if(!orgAdmin) {
        return(Promise.reject(new Error('Organization Admin not set')));
    }

    if(!contactEmail) {
        return(new Error('Contact Email not provided'));
    }

    if(!contactPhone) {
        return(new Error('Contact Phone not provided'));
    }

    if(subscriptionLeft < 0) {
        return(new Error('Invalid Subscription provided'));
    }

    return(postgreDatabase.query("insert into organisations (name, address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) and update user_table set user_type='subAdmin' where id=$3 returning *;", [orgName, address, orgAdmin, contactEmail, contactPhone, subscriptionLeft, photoUrl, isVerified, isActive]))
};

module.exports = {
    postgreDatabase,
    redisDatabase,
    registerUser,
    loginUser,
    registerCompany
}