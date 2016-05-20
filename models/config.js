/**
 * Created by Mil3nIuM on 28.02.2016.
 */


/**
 * Config file. Add any API keys or anything with variables that has to be shared over the code.
 *
 */


/**
 * Client ID'S for facebook and google login
 * Needs to be updated when its goes live! This is only for testing purposes.
 */
var local = false;
var clientID = '564087690414884';
var clientSecret = '66a64c0ce76c6085008a2b52475a1b82';
var callback = 'https://serene-citadel-21016.herokuapp.com/auth/facebook/callback';

if(local) {
    clientID = '564103097080010';
    clientSecret = '5f013066d4a11d264d7905a8f6ad056e';
    callback =  'http://84.212.230.225:5000/auth/facebook/callback'
}

module.exports={
    useDB: false,
    facebook: {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callback
    }
};