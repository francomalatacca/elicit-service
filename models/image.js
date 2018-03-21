var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = Schema({
    noteId: { type: String },
    img: { type: Buffer },
    _create: { type: Date, default: Date.now },
    _lastUpdate: { type: Date }
});

ImageSchema.pre('save', function(next) {
    this._lastUpdate = Date.now();
    next();
});

//Export model
module.exports = mongoose.model('Image', ImageSchema);