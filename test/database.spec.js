const {
    expect,
    assert
} = require('chai');
const {
    postgreDatabase,
    registerUser,
    redisDatabase,
    loginUser
} = require('../tools/database');

describe('Test PostgreSQL database', () => {
    it('should return a row', async () => {
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
        const results = await registerUser('testUser', 1, 'test@test.test', 'test', '1234567890', 'https://google.com/imghp');

        let deleteResult = await postgreDatabase.query("delete from user_table where user_name = 'testUser' returning *;");

        let alterSequenceResult = await postgreDatabase.query(`Select setval('user_table_id_seq', ${results.rows[0].id - 1}, true);`);

        await postgreDatabase.end();
        // console.log('pool has drained');
        expect(results).not.be.empty;
        expect(deleteResult).not.be.empty;
        expect(alterSequenceResult).not.be.empty;
        expect(`${results.rows[0].id - 1}`).to.be.equal(alterSequenceResult.rows[0].setval);

    });

});

describe('Test Redis', () => {
    it('Test Redis Database', async () => {
        await redisDatabase.set('abcd', 1234)
        let value = await redisDatabase.get("abcd");
        await redisDatabase.del('abcd');
        await redisDatabase.disconnect(false);
        // console.log('Redis disconnected');
        expect(value).to.be.equal('1234');

    });
});