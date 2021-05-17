const {
    expect,
    assert
} = require('chai');
const {
    postgreDatabase,
    redisDatabase,
    chatDatabase,
    mongoClient,
    registerCompany,
    registerUser,
    loginUser,
    setAccountActivation
} = require('../tools/database');

describe('Test PostgreSQL database', () => {
    it('Should perform a read operation', async () => {
        try {
            const {
                rows
            } = await postgreDatabase.query('Select * from user_table LIMIT 1;');
            expect(rows).not.be.empty;

        } catch (err) {
            console.log(err);
            assert.fail(err.message);
        }
    });

    it('Should get user details', async () => {
        const {
            rows: [userDetails]
        } = await loginUser('admin@admin.com');

        expect(userDetails).to.include({
            'id': '1',
            'google_id': 'super_admin_google_id',
            'user_name': 'superAdmin',
            'organization': 1,
            'email': 'admin@admin.com',
            'phone_number': '123456789',
            'user_type': 'superAdmin',
            'photo_url': 'https://google.com/imghp',
            'description': 'This is Super Admin Account',
            'isVerified': true,
            'isActive': true,
            'orgSubscription': 365,
            'orgName': 'Default',
            'orgIsActive': true,
            'orgIsVerified': true
        });
    });

    it('Should Successfully register User', async () => {
        const results = await registerUser('testUser', 1, 'test@test.test', 'test', '1234567890', "Default Address", 'Default City', "INDIA", "Maharashtra", 400001, 'https://google.com/imghp');

        let deleteResult = await postgreDatabase.query("delete from user_table where user_name = 'testUser' returning *;");

        let alterSequenceResult = await postgreDatabase.query(`Select setval('user_table_id_seq', ${results.rows[0].id - 1}, true);`);

        // console.log('pool has drained');
        expect(results).not.be.empty;
        expect(deleteResult).not.be.empty;
        expect(alterSequenceResult).not.be.empty;
        expect(`${results.rows[0].id - 1}`).to.be.equal(alterSequenceResult.rows[0].setval);

    });

    it('Should activate and deactivate a user', async () => {
        const deactivated = await setAccountActivation(1, "user", false);

        const activated = await setAccountActivation(1, "user", true);

        expect(deactivated).not.be.empty;
        expect(activated).not.be.empty;
        expect(deactivated.rowCount).to.equal(1, "Account Deactivated");
        expect(activated.rowCount).to.equal(1, "Account Activated");
    });

    it('Should activate and deactivate a company', async () => {
        const deactivated = await setAccountActivation(1, "company", false);

        const activated = await setAccountActivation(1, "company", true);

        expect(deactivated).not.be.empty;
        expect(activated).not.be.empty;
        expect(deactivated.rowCount).to.equal(1, "Company Deactivated");
        expect(activated.rowCount).to.equal(1, "Company Activated");
    });

    it('Should close the connection', async () => {
        try {
            await postgreDatabase.end();
            // assert.isNotOk(postgreDatabase, 'Closed the connection');
        } catch (error) {
            console.log(error);
            assert.fail(error.message);
        }
    });
});

describe('Test Redis', () => {

    it('Test Redis Database', async () => {
        await redisDatabase.set('abcd', 1234)
        let value = await redisDatabase.get("abcd");
        await redisDatabase.del('abcd');
        expect(value).to.be.equal('1234', "Different Value Returned => " + value);

    });

    it('Should Close Redis Database', async () => {
        try {
            await redisDatabase.disconnect(false);
        } catch (err) {
            console.log(err);
            assert.fail(err.message);
        }
    });


});

describe('Test MongoDB', () => {
    it('Test Mongo Database', async () => {
        const chatDatabase = await mongoClient.db('Chats'); 
        const collection = await chatDatabase.collection('Chats');

        const reply = await collection.insertOne({
            "Name": 'Trial Entry',
            "Value": 'Chat System'
        });

        console.log(reply.insertedCount, reply.insertedId, reply.ops[0])

        const deleteReply = await collection.deleteOne({
            "_id": reply.insertedId
        });

        expect(reply.insertedCount).to.be.equal(1, "Insert Failed");
        expect(deleteReply.deletedCount).to.be.equal(1, "Delete Failed");
    });

    it('Should Close Mongo Client', async () => {
        await mongoClient.close();
        expect(true).to.be.true;
    });
});