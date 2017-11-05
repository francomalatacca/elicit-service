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

module.exports = router;