const {
    expect,
    assert
} = require('chai');
const {
    postgreDatabase,
    registerUser,
    redisDatabase
} = require('../tools/database');

describe('Test PostgreSQL database connection', () => {
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

    it('Should Successfully register User', async () => {
        const results = await registerUser('omkaragrawal', 1, 'omkar@omkar.omkar', 'omkar', '1234567890', 'https://google.com/imghp');

        let deleteResult = await postgreDatabase.query("delete from user_table where user_name = 'omkaragrawal' returning *;");

        let alterSequenceResult = await postgreDatabase.query(`Select setval('user_table_id_seq', ${results.rows[0].id - 1}, true);`);

        
        expect(results).not.be.empty;
        expect(deleteResult).not.be.empty;
        expect(alterSequenceResult).not.be.empty;
        expect(`${results.rows[0].id - 1}`).to.be.equal(alterSequenceResult.rows[0].setval);
        
    });

});