//! app.js
//!
//! This file contains server setup, application setup,
//! and routing logic for the SecureLog template.

/* IMPORTS */

const argon2 = require('argon2')
const cookieParser = require('cookie-parser')
const express = require('express')
const http = require('http')
const path = require('path')

const dbUtils = require('./database/utils.js')
const tokenUtils = require('./tokens/utils.js')

/* GENERAL CONSTANTS */

const port = 3000

/* SERVER SETUP */

const app = express()
const server = http.createServer(app)
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static('styles'))

/* ROUTING */

// landing page
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// login page, with potential flags to indicate login errors
app.get('/login', (req, res) => {
    const { userExistsFlag, invalidCredentialsFlag } = req.query
    const ejsFlags = { userExistsFlag: userExistsFlag || 0, invalidCredentialsFlag: invalidCredentialsFlag || 0 }
    res.render(path.join(__dirname, '/views/login.ejs'), ejsFlags)
})

// signup page, with potential flags to indicate signup errors
app.get('/signup', (req, res) => {
    const { userExistsFlag } = req.query
    const ejsFlags = { userExistsFlag: userExistsFlag || 0 }
    res.render(path.join(__dirname, '/views/signup.ejs'), ejsFlags)
})

// authenticated landing page
app.get('/auth/landing', async (req, res) => {
    const { username } = req.query
    decoded = tokenUtils.validToken(req.cookies.token)
    if (decoded && decoded._id == username) {
        res.render(path.join(__dirname, '/views/landing.ejs'), { username: username || 'User' })
    } else {
        res.redirect('/login')
    }
})

// post request to signup a new user
app.post('/signup/newaccount', async (req, res) => {
    try {
        const username = String(req.body.username) 
        const { user, error } = await dbUtils.fetchUser(username)
        if (error) {
            res.redirect('/signup')
        }
        if (user) { // surface issue of user already existing
            res.redirect('/signup?userExistsFlag=1')
        }
        const password = String(req.body.password)
        if (await dbUtils.insertUser(username, password)) {
            res.redirect('/signup')
        } else {
            res.cookie('token', tokenUtils.generateToken(username), {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })
            res.redirect("/auth/landing?username=" + username)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('could not register new user')
    }
})

// post request to validate user credentials
app.post('/login/verify', async (req, res) => {
    try {
        const username = String(req.body.username)
        const password = String(req.body.password)
        const { user, error } = await dbUtils.fetchUser(username)
        if (error) {
            res.redirect('/login')
        }
        if (user == null) {
            res.redirect('/login?userExistsFlag=1')
        }
        if (!password || !await argon2.verify(user.hash, user.salt + password)) {
            res.redirect('/login?invalidCredentialsFlag=1')
        } else {
            res.cookie('token', tokenUtils.generateToken(username), {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })
            res.redirect("/auth/landing?username=" + username)
        }
    } catch (error) {
        console.error('error during login:', error)
        res.status(500).send('could not login user', error)
    }
})

// 404 page
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'))
})

/* HOSTING */

server.listen(port, () => {
    console.log("listening on " + port)
})