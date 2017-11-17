var mongoose = require('mongoose');
var sha1 = require('sha1');


var Schema = mongoose.Schema;

var UserSchema = Schema({
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    alias: { type: String, required: true, unique: true, max: 32 },
    email: { type: String, required: true, unique: true, max: 32 },
    password: { type: String, required: true, max: 32 },
    groupUrl: { type: Array },
    projects: { type: Array },
    _activationUrl: { type: String, max: 100 },
    _create: { type: Date, default: Date.now },
    _lastUpdate: { type: Date }
});


UserSchema
    .virtual('name')
    .get(function() {
        return this.firstName + " " + this.lastName;
    });



UserSchema.pre('save', function(next) {
    var base = "aAbBcCdDeEfFgGhHiIlLmMnNoOpPqQrRsSTtUuVvXxWwZz0987654321"
    var cypher = [];
    for (var i = 0; i < 8; i++) {
        var r = Math.floor(Math.random() * 56);
        cypher.push(base[r]);
    }

    this.projects = this.projects || [];
    if (typeof this.project["public"] === 'undefined') {
        this.projects = ["public"];
    }

    this._activationUrl = sha1(cypher.join(''));
    this.password = sha1(this.password + process.env.SALT || "s3cr3tSalt-01");
    this._lastUpdate = Date.now();

    next();
});
//Export model
module.exports = mongoose.model('User', UserSchema);