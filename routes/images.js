var express = require('express');
var router = express.Router();
var Image = require('../models/image');

router.get('/', function(req, res, next) {
    var url = req.query.url;
    var selector = req.query.selector;
    var _s = {}
    var _excl = { navigator: false };


    if (selector) {
        _s["selector"] = selector;
    }

    if (url) {
        _s["url"] = url;
    }

    _excl["user"] = false;
    _excl["image"] = false;
    Image.find(_s, _excl).exec(function(err, images) {
        if (err) { return next(err); }
        //Successful, so render
        res.status(200).send(images);
    })


});

router.get('/:id', function(req, res, next) {

    var _s = {};
    _s["_id"] = req.params.id;
    var _excl = {};

    Image.findOne(_s, _excl).exec(function(err, image) {
        if (err) { return next(err); }
        //Successful, so render
        res.status(200).send("data:image/png;base64," + new Buffer(image.img).toString("base64"));
    })


});

router.post('/', function(req, res, next) {
    if (req.auth === false) {
        res.status(401).send({ "error": "user is not authenticated", "code": "401" })
    } else {
        req.body = req.body || {};
        var string = req.body.img;
        var bindata = new Buffer(string.split(",")[1], "base64");

        var imageModel = new Image({
            noteId: req.body.noteId,
            img: bindata
        });

        imageModel.save(function(err, img) {
            if (err) {
                res.status(400).send({ "error": err });
                return false;
            }
            res.status(201).send(img);
        });
    }
});

module.exports = router;