var jwt = require('jwt-simple');
var config = require('../config/database');
var util = require('./util');
var User = require("../models/user");

exports.authenticate = function(req, res){
    console.log("Searching", req.body.username);
    User.findOne({
       "local.username": req.body.username
    }, function (err, user) {
        if(err){
            console.log("Err",err);
            throw err;
        }

        if(!user){
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
               if(isMatch && !err){
                    var token = jwt.encode(user, config.secret);
                    res.json({success: true, user: user, token: 'JWT ' + token});
               } else {
                   res.send({success: false, msg: 'Authentication failed. Wrong password.'});
               }
            });
        }
    });
};

exports.signUp = function(req, res){
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass usernamename and password.'});
    } else {
        var newUser = new User({
            "local.username": req.body.username,
            "local.password": req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                console.log("Err",err);
                return res.json({success: false, msg: 'Username already exists.'});
            }

            var token = "JWT "+jwt.encode(newUser, config.secret);
            res.json({success: true, user: newUser, token: token})
        });
    }
};

/**
 * TODO: 
 * Maybe this is very unsafe, bc, if you get the token of a user, you can get his data
 * But he would also not have a problem deleting projects, as you only need the token
 */
exports.userByToken = function(req, res){
    var decoded = util.exctractToken(req.body.token);
    if (!decoded) {
        return res.send({success: false, msg: 'Authentication failed. User not found.'});
    }
    User.findOne({_id: decoded._id}, function(err, user) {
        if (err) throw err;
        
        res.send({success: true, user: user});
    });
}