/**
 * Created by Mil3nIuM on 28.02.2016.
 */

/**
 * Object that contains all the different ways to authenticate with the server
 * Added:
 *  - Google, Facebook and HTTP Login
 *
 *  Update needed:
 *   - Combine adding user to the database. No need to have copy/paste code between facebook/google
 *
 * @type {Passport|exports|module.exports}
 */

/**
 * Others required files
 */
var passport = require('passport');

var FacebookStrategy = require('passport-facebook');

/**
 * My required files
 */
var Account = require('../models/account');
var conf = require('../models/config');
var util = require('util');

/**
 * FACEBOOK
 *
 * Adding facebook authentication. If you try to logg inn with a facebook user it will register one for you.
 */
module.exports = passport.use(new FacebookStrategy({
        clientID: conf.facebook.clientID,
        clientSecret: conf.facebook.clientSecret,
        callbackURL: conf.facebook.callbackURL,
        profileFields: ['email', 'displayName']
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            Account.findOne({oauthID: profile.id}, function (err, user) {

                if (err) console.error(err);

                if (!err && user != null) {
                    done(null, user);
                } else {
                    var email = "";
                    try {
                        if(profile.emails[0].value) {
                            email = profile.emails[0].value;
                        }
                    } catch(err2) {
                        console.error("Warning: No user email linked to facebook profile.")
                    }

                    console.log(profile.id + " " + profile.displayName + " : " + email + " : ");

                    user = new Account({
                        oauthID: profile.id,
                        username: profile.displayName,
                        email: email,
                        phone: 0,
                        admin: false,
                        created: Date.now()
                    });
                    user.save(function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("User added : " + profile.displayName);
                            done(null, user);
                        }
                    });
                }
            });
        });
    }
));


/**
 * Serialize the user when connecting. This is to save cookie and keep the connection live
 */
passport.serializeUser(function (user, done) {
    console.log('SerializeUser: ' + user._id);
    done(null, user._id);
});

/**
 * Disconects the user from session when finished sending packages. Sends user cookies to recognize the user afterwards.
 */
passport.deserializeUser(function (id, done) {
    Account.findById(id, function (err, user) {
        if (!err) done(null, user);
        else done(err, null);
    });
});