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
        res.end();
    } else {
        console.log(req.authorization.email, "tempted access");
        User.findOne({ email: req.authorization.email }, { email: true, alias: true, project: true }).exec(function(err, user) {
            if (err) { return next(err); }
            if (user) {
                res.status(200).send(user);
            }
            res.status(401).send();
        })
    }
});

module.exports = router;