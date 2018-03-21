var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = Schema({
    topic: { type: String, required: true, max: 100 },
    comment: {
        "type": { type: String, required: true, max: 8, default: "element" },
        "value": { type: String, required: true, max: 255 },
        checksum: {
            "html": { type: String, required: true, max: 64 },
            "text": { type: String, required: true, max: 64 }
        },
        event: {
            "type": { type: String, required: true, max: 64 }
        },
        "selector": { type: String, required: true },
        "selected": { type: String },
        "value": { type: String, required: true }
    },
    coordinates: {
        bottom: Number,
        top: Number,
        left: Number,
        right: Number,
        height: Number,
        width: Number,
        x: Number,
        y: Number,
        screen_height: Number,
        screen_width: Number,
        window_height: Number,
        window_width: Number,
        document_height: Number,
        document_width: Number
    },
    navigator: {
        appCodeName: { type: String },
        appName: { type: String },
        appVersion: { type: String },
        connection: {
            downlink: { type: Number },
            effectiveType: { type: String }
        },
        cookieEnabled: { type: Boolean },
        language: { type: String },
        maxTouchPoints: { type: Number },
        platform: { type: String },
        product: { type: String },
        productSub: { type: String },
        userAgent: { type: String, required: true },
        vendor: { type: String }
    },
    location: {
        host: { type: String },
        hostname: { type: String },
        href: { type: String },
        origin: { type: String },
        pathname: { type: String },
        port: { type: String },
        protocol: { type: String }
    },
    user: { type: String, required: true, max: 100 },
    _browser: { type: String },
    _create: { type: Date, default: Date.now },
    _lastUpdate: { type: Date }
});


CommentSchema
    .virtual('url')
    .get(function() {
        return location.href;
    });

CommentSchema
    .virtual('address')
    .get(function() {
        return "elicit://" + this.group + '/' + this.url;
    });

// Virtual for author's URL
CommentSchema
    .virtual('groupUrl')
    .get(function() {
        return '/group/' + this.group;
    });

CommentSchema.pre('save', function(next) {
    this._lastUpdate = Date.now();
    try {
        this._browser = browser(this.navigator);
    } catch (ex) {
        console.error(ex);
    }
    this._lastUpdate = Date.now();

    next();
});

function browser(navigator) {
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

//Export model
module.exports = mongoose.model('Comment', CommentSchema);