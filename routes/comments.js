var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

/* GET comment listing. */
router.get('/', function(req, res, next) {
    var topic = req.query.topic;
    var url = req.query.url;
    var _s = {}

    var _excl = { navigator: false };

    if (topic || topic === "public") {
        _s["topic"] = topic || "public";
    }

    if (url) {
        _s["location.href"] = decodeURIComponent(url);
    }

    Comment.find(_s, _excl).exec(function(err, comments) {
        if (err) { return next(err); }
        res.status(200).send(comments);
    })
});

router.post('/', function(req, res, next) {
    let checksum = {
        "text": null,
        "html": null
    };

    let event = {
        "type": null
    };

    let comment = {
        "checksum": checksum,
        "event": event,
        "selector": null,
        "selected": "",
        "value": ""
    };

    if (req.auth === false) {
        res.status(401).send({ "error": "user is not authenticated", "code": "401" })
    } else {
        req.body = req.body || {};

        req.body.comment = req.body.comment || comment;

        req.body.comment = req.body.comment || {};
        req.body.comment.checksum = req.body.comment.checksum || checksum;
        req.body.comment.event = req.body.comment.event || event;

        comment = {
            "checksum": {
                "html": req.body.comment.checksum.html,
                "text": req.body.comment.checksum.text
            },
            "event": {
                "type": req.body.comment.event.type
            },
            "selected": req.body.comment.selected,
            "selector": req.body.comment.selector,
            "value": req.body.comment.value
        }

        req.body.navigator = req.body.navigator || {};
        req.body.navigator.connection = req.body.navigator.connection || {};
        var navigator = {
            appCodeName: req.body.navigator.appCodeName,
            appName: req.body.navigator.appName,
            appVersion: req.body.navigator.appVersion,
            connection: {
                downlink: req.body.navigator.connection.downlink,
                effectiveType: req.body.navigator.connection.effectiveType
            },
            cookieEnabled: req.body.navigator.cookieEnabled,
            language: req.body.navigator.language,
            maxTouchPoints: req.body.navigator.maxTouchPoints,
            platform: req.body.navigator.platform,
            product: req.body.navigator.product,
            productSub: req.body.navigator.productSub,
            userAgent: req.body.navigator.userAgent,
            vendor: req.body.navigator.vendor
        }

        req.body.coordinates = req.body.coordinates || {};
        req.body.coordinates.screen = req.body.coordinates.screen || {};
        req.body.coordinates.window = req.body.coordinates.window || {};
        req.body.coordinates.document = req.body.coordinates.document || {};
        var coordinates = {
            x: req.body.coordinates.x,
            y: req.body.coordinates.y,
            left: req.body.coordinates.left,
            right: req.body.coordinates.right,
            top: req.body.coordinates.top,
            bottom: req.body.coordinates.bottom,
            height: req.body.coordinates.height,
            width: req.body.coordinates.width,
            screen_height: req.body.coordinates.screen.height,
            screen_width: req.body.coordinates.screen.width,
            window_height: req.body.coordinates.window.height,
            window_width: req.body.coordinates.window.width,
            document_height: req.body.coordinates.document.height,
            document_width: req.body.coordinates.document.width
        }

        var location = {
            host: req.body.location.host,
            hostname: req.body.location.hostname,
            href: req.body.location.href,
            origin: req.body.location.origin,
            pathname: req.body.location.pathname,
            port: req.body.location.port,
            protocol: req.body.location.protocol
        }

        var model = new Comment({
            comment: comment,
            navigator: navigator,
            location: location,
            coordinates: coordinates,
            user: req.authorization.alias,
            topic: req.body.topic,
        });

        model.save(function(err, note) {
            if (err) {
                res.status(400).send({ "error": err });
                return false;
            }
            res.status(201).send(note);
        });
    }
});

router.patch('/', function(req, res, next) {
    if (req.auth === false) {
        res.status(401).send({ "error": "user is not authenticated", "code": "401" })
    } else {
        req.body = req.body || {};
        req.body.navigator = req.body.navigator || {};
        req.body.navigator.connection = req.body.navigator.connection || {};

        var navigator = {
            appCodeName: req.body.navigator.appCodeName,
            appName: req.body.navigator.appName,
            appVersion: req.body.navigator.appVersion,
            connection: {
                downlink: req.body.navigator.connection.downlink,
                effectiveType: req.body.navigator.connection.effectiveType
            },
            cookieEnabled: req.body.navigator.cookieEnabled,
            language: req.body.navigator.language,
            maxTouchPoints: req.body.navigator.maxTouchPoints,
            platform: req.body.navigator.platform,
            product: req.body.navigator.product,
            productSub: req.body.navigator.productSub,
            userAgent: req.body.navigator.userAgent,
            vendor: req.body.navigator.vendor
        }

        var model = new Comment({
            note: req.body.note,
            group: req.body.group,
            urls: req.body.urls,
            navigator: navigator,
            selector: req.body.selector,
            user: req.authorization.alias
        });

        model.save(function(err, note) {
            if (err) {
                res.status(400).send({ "error": err });
                return false;
            }

            res.status(201).send(note);
        });
    }
});

router.put('/:id', function(req, res, next) {
    var model = new Comment({
        _id: req.param._id,
        comment: req.body.comment,
        topic: req.body.topic
    });

    model.save(function(err, note) {
        if (err) {
            res.status(400).send({ "error": err });
            return false;
        }

        res.status(201).send(note);
    });
});

module.exports = router;