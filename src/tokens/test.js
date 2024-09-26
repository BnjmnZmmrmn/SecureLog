//! tokens/test.js
//!
//! This file contains testing of token
//! utility functions.

/* IMPORTS */

const jwt = require('jsonwebtoken')
const tokenUtils = require('./utils.js')
const tokenConfig = require('./../scripts/parse_token_config.js')

/* MOCKS */

jest.mock('jsonwebtoken')

/* TESTS */

describe('Token Utility Functions', () => {

    // tests that username is preserved in token
    describe('generateToken', () => {
        it('should generate a JWT token with username', () => {
            const username = 'annie'
            const fakeToken = 'fake-jwt-token'
            jwt.sign.mockReturnValue(fakeToken)
            const token = tokenUtils.generateToken(username)
            expect(jwt.sign).toHaveBeenCalledWith(
                { _id: username },
                tokenConfig.secret_key,
                { expiresIn: '24h' }
            )
            expect(token).toBe(fakeToken)
        })
    })
    
    // tests that a generated token validates (or is null)
    describe('validToken', () => {
        it('should validate a valid JWT token', () => {
            const validToken = 'valid-token'
            const decodedPayload = { _id: 'testUser' }
            jwt.verify.mockReturnValue(decodedPayload)
            const result = tokenUtils.validToken(validToken)
            expect(jwt.verify).toHaveBeenCalledWith(validToken, tokenConfig.secret_key)
            expect(result).toEqual(decodedPayload)
        })
        
        it('should return null for an invalid JWT token', () => {
            const invalidToken = 'invalid-token'
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token')
            })
            const result = tokenUtils.validToken(invalidToken)
            expect(jwt.verify).toHaveBeenCalledWith(invalidToken, tokenConfig.secret_key)
            expect(result).toBeNull()
        })
    })
})