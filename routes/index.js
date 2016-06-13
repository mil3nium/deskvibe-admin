/**
 * Home page.
 * Allot of the login authentication with google and facebook implemented here.
 *
 * May need to be moved to other pages.
 *
 * @type {*|exports|module.exports}
 */

var express = require('express');
var router = express.Router();

var passport = require('passport');
var busboy = require('connect-busboy');
var request = require('request');

//var validator = require('validator');

const _SUCCESS = function(res) {
    return res.status(200).send('{"success" : "Operation Successfully", "status" : 200}').end();
}

var util = require('util');
var Spaces = require('../models/spaces.js');

var googleApiKey = "=AIzaSyCmNSL6HgFcjoxc9ae8CUy0auroSoYypzM";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* Returns the template for our venues. So we all only need to update it on the server */
router.get('/getTemplate', function(req, res, next) {
    res.status(200).send(Spaces.getTemplate()).end();
});

router.post('/getVenue', function(req, res, next) {
    if(req.body._id) {
        Spaces.getVenues(req.body._id, function(err, venue) {
            if(!err) {
                _SUCCESS(res);
            } else {
                console.error(err);
                res.status(500).end("Could not fetch Venue");
            }
        })
    }
});

/* Returns all the venues in the DB */
router.get('/getVenues', function(req, res, next) {
    Spaces.getVenues(null, function(err, venues) {
        if(!err) {
            res.status(200).send(venues).end();
        } else {
            console.error(err);
            res.status(500).end("Could not fetch VenueList");
        }
    });
});
      
/* Saves the venue */
router.post('/saveVenue', function(req, res, next) {
    if(req.body.venue) {
        Spaces.saveVenue(req.body.venue, function(err, venue) {
            if(!err) {
                res.status(200).send(venue).end();
            } else {
                console.error(err);
                res.status(500).end("Could not save data to Database");
            }
        });
    }
});

/* Deletes the venue through ID. Should be changed in later stage when we have login.  */
router.post('/deleteVenue', function(req, res, next) {
    if(req.body._id) {
        Spaces.deleteVenue(req.body._id, function(err) {
            if(!err) {
                _SUCCESS(res);
            } else {
                console.error(err);
                res.status(500).end(err);
            }
        });
    } else {
        res.status(400).end("Bad request: No ID");
    }
});

/* This connects to the google API. Should be changed to user side when we're not using Heroku. */
router.post('/getGoogleData', function(req, res, next) {

    if(req.body.googleAddress) {
        var address = req.body.googleAddress.replace(/æ/gi, "ae");
        address = address.replace(/ø/gi, "o");
        address = address.replace(/å/gi, "a");
        var options = {
            proxy: process.env.QUOTAGUARDSTATIC_URL,
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&language=en&key" + googleApiKey,
            headers: {
                'User-Agent': 'node.js'
            }
        };

        function callback(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.status(200).send(body).end();
            } else {
                console.error(error);
                res.status(500).end("No address with that name")
            }
        }
        
        request(options, callback);
    } else {
        res.status(400).end("No address given");
    }
});
 

/* User login with facebook. This is not used at the moment. Should be added at later stage when we need more security. */
router.get('/auth/facebook' ,
    passport.authenticate('facebook', {scope: ['email']}),
    function(req, res) {}
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook' ,
        {
            successRedirect: '/',
            failureRedirect: '/'
        }), function(req, res) {
         res.next();
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else {
        res.status(400);
        res.redirect('/auth/facebook');
    }
}

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.admin)
            return next();
        else {
            res.status(400);
            res.redirect('/auth/facebook');
        }
    } else {
        res.status(400);
        res.redirect('/auth/facebook');
    }
}

module.exports = router;
