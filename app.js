var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var auth = require('cavecanem');
var sha1 = require('sha1');

var index = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');


var cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var User = require('./models/user');

/**
 * Given a base64 encoded string it returns a decoded string
 * @param authorization (encoded base64)
 * @returns {string} decoded string
 */
function atob(authorization) {
    return new Buffer(authorization, 'base64').toString('binary');
}

/**
 * Extracts the raw authorization string and returns an
 * object containing username and password fields.
 * @param authorizationString
 * @returns {{username: *, password: *}}
 */
var extractCredentialsFromHeader = function(authorizationString) {
    var authorization = authorizationString.split(' ');
    var username = null;
    var password = null;
    if (authorization.length > 0) {
        authorization = authorizationString.split(' ')[1];
        authorization = atob(authorization);
        username = authorization.split(':')[0];
        password = authorization.split(':')[1];
    } else {
        throw new Error("Bad authentication format");
    }
    return { username: username, password: password };
};

/**
 *
 * @param authorizationString
 * @returns {boolean}
 */
var checkAuthorizationString = function(authorizationString) {
    return (/[Basic ][A-Za-z_=]{4,256}/).test(authorizationString);
};

var auth = function(req, res, next) {

    var authorizationString = req.header('authorization');

    if (authorizationString && checkAuthorizationString(authorizationString)) {
        var credentials = extractCredentialsFromHeader(authorizationString);
        User.findOne({ email: credentials.username, password: sha1(credentials.password + process.env.SALT || "s3cr3tSalt-01") }).exec(function(err, u) {
            console.log(err, u);
        }).then(function(obj) {
            req.auth = obj === null ? false : true;
            next();
        });

    } else {
        req.auth = false;
        next();
    }
}


app.use('/', index);
app.use('/users', auth, cors(), users);
app.use('/notes', auth, cors(), notes);

var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/elicitdb';
mongoose.connect(mongoDB, {
    useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;