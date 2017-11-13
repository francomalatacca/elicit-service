var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var userModel = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    userModel.save(function(err, user) {
        if (err) {
            res.status(400).send(err);
            return false;
        }

        res.status(201).send(user);
    });
});

router.post('/login', function(req, res, next) {
    if (req.auth === false) {

        res.writeHead(401, { "WWW-Authenticate": "Basic realm=\"elicit realm\"" });
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Set-Cookie': "Authorization=" + req.header('authorization')
        })
        res.end();
    }
});

module.exports = router;