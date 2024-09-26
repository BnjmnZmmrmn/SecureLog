//! database/test.js
//!
//! This file contains testing of database
//! utility functions.

/* IMPORTS */

const dbUtils = require('./utils.js')

/* TESTS */

describe('Database Utility Functions', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();  // reset mocks before each test
    })

    // tests connection to db
    describe('establishConnection', () => {
        it('should successfully connect and close the client', async () => {
            const result = await dbUtils.establishConnection()
            expect(result).toBeNull()
        })
    })
})