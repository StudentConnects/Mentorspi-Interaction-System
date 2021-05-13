/* eslint-disable node/no-unpublished-require */
const redis = require('ioredis');
const {
    Pool
} = require('pg');

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
 * @param  {String} userType='student' UserType of the user (for future use) current default to student
 * @param  {String} userType='mentor' 
 * @param  {String} userType='subAdmin'
 * @param  {String} userType='superAdmin'
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
}

module.exports = {
    redisDatabase,
    postgreDatabase,
    registerUser
}