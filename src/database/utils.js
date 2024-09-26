//! database/utils.js
//!
//! This file contains database utility functions to
//! interact with a Mongodb database.

/* IMPORTS */

const mongoConfig = require('./../scripts/parse_mongo_config.js') // api key

const argon2 = require('argon2')
const crypto = require('crypto')
const { MongoClient, ServerApiVersion } = require('mongodb')

/* CLIENT & COLLECTIONS */

const client = new MongoClient(mongoConfig.uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
const users = client.db(mongoConfig.db).collection('users') // userdata storage

/* OPERATIONS */

// used to test connection to db
async function establishConnection() {
    try {
        await client.connect()
        await client.close()
        return null
    } catch (error) {
        return error
    }
}

// takes in a username and password, generating a random
// 32 byte salt and inserting
// { _id: username, salt: salt, hash: hash(salt + password) }
// into the user collection
async function insertUser(username, password) {
    try {
        await client.connect()
        const salt = String(crypto.randomBytes(32))
        const userdata = {
            _id: username,
            salt: salt,
            hash: await argon2.hash(salt + password),
        }
        await users.insertOne(userdata)
        await client.close()
        return null
    } catch (error) {
        return error
    }
}

// takes in a username and returns the first
// document in the user collection where query
// { _id: username }
// matches
async function fetchUser(username) {
    try {
        const query = { _id: username }
        await client.connect()
        const userData = await users.findOne(query)
        await client.close()
        return { user: userData, error: null }
      } catch (error) {
        return { user: null, error: error }
    }
}

/* EXPORTS */

module.exports = {
    establishConnection: establishConnection,
    insertUser: insertUser,
    fetchUser: fetchUser,
}