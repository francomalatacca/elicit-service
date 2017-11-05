var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = Schema({
    note: { type: String, required: true, max: 9999 },
    group: { type: String, required: true, max: 100 },
    selector: { type: String, required: true, max: 255 },
    url: { type: String, required: true, max: 100 },
    _create: { type: Date, default: Date.now },
    _lastUpdate: { type: Date }
});


NoteSchema
    .virtual('address')
    .get(function() {
        return "elicit://" + this.group + '/' + this.url;
    });

// Virtual for author's URL
NoteSchema
    .virtual('groupUrl')
    .get(function() {
        return '/group/' + this.group;
    });

NoteSchema.pre('save', function(next) {
    this._lastUpdate = Date.now();
    next();
});
//Export model
module.exports = mongoose.model('Note', NoteSchema);