var jwt = require('jwt-simple');
var config = require('../config/database');

exports.extractTokenUser = function(headers) {
        if (headers && headers.authorization) {
            return this.exctractToken(headers.authorization);
        } else {
            return null;
        }
};

exports.exctractToken = function(token) {
    var parted = token.split(' ');
    if (parted.length === 2) {
        return jwt.decode(parted[1], config.secret);
    } else {
        return null;
    }
};