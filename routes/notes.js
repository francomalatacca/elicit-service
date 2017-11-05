var express = require('express');
var router = express.Router();
var Note = require('../models/note');

/* GET notes listing. */
router.get('/', function(req, res, next) {
    Note.find({}).exec(function(err, notes) {
        if (err) { return next(err); }
        //Successful, so render
        res.status(200).send(notes);
    })
});

router.post('/', function(req, res, next) {
    var noteModel = new Note({
        note: req.body.note,
        group: req.body.group,
        url: req.body.url
    });

    noteModel.save(function(err, note) {
        if (err) {
            res.status(400).send({ "error": err });
            return false;
        }

        res.status(201).send(note);
    });
});

router.put('/:id', function(req, res, next) {
    var noteModel = new Note({
        _id: req.param._id,
        note: req.body.note,
        group: req.body.group,
        url: req.body.url
    });

    noteModel.save(function(err, note) {
        if (err) {
            res.status(400).send({ "error": err });
            return false;
        }

        res.status(201).send(note);
    });
});

module.exports = router;