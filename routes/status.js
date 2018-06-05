var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.auth === false) {
        res.status(200).send({ "status": true, "authentication": false });
    } else {
        res.status(200).send({ "status": true, "authentication": true, "username": auth.username });
    }
});
module.exports = router;