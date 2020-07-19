// imports
const express = require('express')


// constants
const SERVER_PORT = 5000

const apiGenHandler = require('./apiGenHandler')

const handler = new apiGenHandler.apiGenHandler()

const app = express()

app.get('/', function (req, res) {

    return res.status(200).json({ "message": "API Key Generator Assignment from Codeuino for LF Mentorship" }).send()
})

app.post('/key', function (req, res) {
    var stat = handler.genApiKey()
    var code = 200
    var resp = { "message": "Generated" }
    if (stat == false) {
        resp.message = "Failed"
        code = 404
    }
    return res.status(code).json(resp).send()
})

app.get('/key', function (req, res) {
    var key = handler.getAvailableAPIKey()
    var resp = { "message": "Success", "key": key }
    var code = 200
    if (key == false) {
        resp.message = "Failed"
        code = 404
    }
    return res.status(code).json(resp).send()
})

// Route to unblock the given key
app.post('/key/unblock', function (req, res) {
    var key = req.query.api
    var stat = handler.unblockAPIKey(key)
    var resp = {"message": "Success"}
    var code = 200
    if (stat == false) {
        resp.message = "Failed"
        code = 404
    }
    return res.status(code).json(resp).send()
})

// Route to delete the given key
app.delete('/key', function (req, res) {
    var key = req.query.api
    var stat = handler.deleteAPIKey(key)
    var resp = {"message": "Success"}
    var code = 200
    if (stat == false) {
        resp.message = "Failed"
        code = 404
    }
    return res.status(code).json(resp).send()
})

// Route for users to keep their keys active
app.post('/key/poll', function (req, res) {
    var key = req.query.api
    var stat = handler.pollApiKey(key)
    console.log(stat)
    var resp = {"message": "Success"}
    var code = 200
    if (stat == false) {
        resp.message = "Failed"
        code  = 404
    }
    return res.status(code).json(resp).send()
})


app.listen(SERVER_PORT, () => console.log(`API Key Gen is listening at http://localhost:${SERVER_PORT}`))