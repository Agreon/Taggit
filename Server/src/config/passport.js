var LocalStrategy = require('passport-local').Strategy;
//var JwtStrategy = require('passport-jwt').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config/database');
var User = require('../models/user');

exports.extractToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = function(passport) {

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));

   /* localLogin = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function(username, password, done) {
            User.findOne({ 'local.username' : username}, function(err, user) {
                if(err) { return done(err); }
                if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

                user.comparePassword(password, function(err, isMatch) {
                    if (err) { return done(err); }
                    if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }

                    return done(null, user);
                });
            });
        });

    const jwtOptions = {
        // Telling Passport to check authorization headers for JWT
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        // Telling Passport where to find the secret
        secretOrKey: config.secret
    };

    // Setting up JWT login strategy
    const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
        User.findById(payload._id, function(err, user) {
            if (err) { return done(err, false); }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });

    passport.use(jwtLogin);
    passport.use(localLogin);
*/

    /*

	// TODO: Maybe change to _id
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
    	usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    }, 
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                //return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                return done(null, false, "Email already registered");
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));*/

};
