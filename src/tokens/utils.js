//! tokens/utils.js
//!
//! This file contains token utility functions to
//! generate and validate tokens.

/* IMPORTS */

const tokenConfig = require('./../scripts/parse_token_config.js')
const jwt = require('jsonwebtoken')

/* OPERATIONS */

function generateToken(username) {
    return jwt.sign({ _id: username }, tokenConfig.secret_key, { expiresIn: '24h' })
}

function validToken(token) {
    try {
        return jwt.verify(token, tokenConfig.secret_key)
    } catch (error) {
        return null
    }
}

/* EXPORTS */

module.exports = {
    generateToken: generateToken,
    validToken: validToken,
}