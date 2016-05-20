/**
 * Created by Mil3nIuM on 28.02.2016.
 */

/**
 * Content of all the specific user interaction with the server.
 *
 * Needs to be added:
 *  - Change password, hashing
 *  - MOVE update userinfo into here from /user.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

/**
 * List over an accounts atributes, this is to make it easier to fetch data from the user while coding.
 * @type {mongoose.Account}
 */
var Account = new Schema({
    oauthID: Number,
    username: String,
    phone: Number,
    email: String,
    admin: Boolean,
    created: Date
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
