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

var util = require('util');
var Spaces = require('../models/spaces.js');

var googleApiKey = "=AIzaSyCmNSL6HgFcjoxc9ae8CUy0auroSoYypzM";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

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
                res.status(200).send(body);
                res.end();
            } else {
                console.log(error);
                res.status(500).end("No address with that name")
            }
        }
        
        request(options, callback);
    } else {
        res.status(400).end("No address given");
    }
});
 
router.post('/deleteVenue', function(req, res, next) {
    if(req.body._id) {
        Spaces.deleteVenue(req.body._id, function(err) {
            if(!err) {
                res.status(200).send('{"success" : "Removed Successfully", "status" : 200}');
                res.end();
            } else {
                res.status(500).end(err);
            }
        });
    } else {
        res.status(400).end("Bad request: No ID");
    }
});

router.get('/getTemplate', function(req, res, next) {
    res.status(200).send(Spaces.getTemplate())
})

router.post('/getVenue', function(req, res, next) {
    if(req.body._id) {
        Spaces.getVenues(req.body._id, function(err, venue) {
            if(!err) {
                res.status(200).send(venue);
                res.end();
            } else {
                res.status(500).end("Could not fetch Venue : " + err);
            }
        })
    }
});

router.get('/getVenues', function(req, res, next) {
    Spaces.getVenues(null, function(err, venues) {
        if(!err) {
            res.status(200).send(venues);
            res.end();
        } else {
            res.status(500).end("Could not fetch VenueList : " + err);
        }
    });
});

router.post('/saveVenue', function(req, res, next) {
    if(req.body.venue) {
        Spaces.saveVenue(req.body.venue, function(err, venue) {
            if(!err) {
                res.status(200).end(venue);
            } else {
                console.error(err);
                res.status(500).end("Could not save data to Database");
            }
        });
    }
})

router.post('/saveSpace', function(req, res, next) {

    if(req.body._id && req.body.state && req.body.name && req.body.contact_name && req.body.contact_email &&
            req.body.street && req.body.street_number && req.body.postal_code && req.body.postal_town && req.body.county,
            req.body.country && req.body.lat && req.body.lng) {

        
        Spaces.addSpace(req.body._id, req.body.state, req.body.name, req.body.contact_name, req.body.contact_email,
            req.body.street, req.body.street_number, req.body.postal_code, req.body.postal_town, req.body.county,
            req.body.country, req.body.lat, req.body.lng, function(err, office) {
            if(!err) {
                res.status(200).send('{"success" : "Added Successfully", "status" : 200}', office);
                res.end('{"success" : "Added Successfully", "status" : 200}');
            } else {
                res.status(500).end(err, null);
            }
        });
    } else {
        res.status(400).end("Not all data was filled out. Try again with correct data")
    }
});

router.post('/saveData', function(req, res, next) {

    var data = [];
    var office = false;

    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        if(val != "") {
            /**
             * ALL DATA NEEDS TO BE SANITISED !!! FIX!
             */
            //val = validator.escape(val);
            if(fieldname === 'tags' || fieldname === "amenities") {
                data.push({fieldname: fieldname, val: val.split(",")});
            } else if(fieldname == "open_hours") {
                data.push({fieldname: fieldname, val: JSON.parse(val)});
            }
            else if (fieldname == "office"){office = true;}
            else if(fieldname == "_id") { data.push(val); }
            else data.push({fieldname: fieldname, val: val});
        }
    });

    req.busboy.on('finish', function() {
        if(!office) {
            Spaces.saveData(data.shift(), data, function(err, venue) {
                if(!err) {
                    res.status(200).send(venue);
                } else {
                    res.status(500).end("Something went wrong when saving data : " + err);
                }
            });
        } else {
            Spaces.saveOffice(data.shift(), data, function(err, venue) {
                if(!err) {
                    console.log(venue);
                    res.status(200).send(venue);
                    res.end();
                } else {
                    res.status(500).end(err);
                }
            });
        }
    });
});

router.post('/deleteOffice', function(req, res, next) {
    if(req.body._id && req.body.office_id) {
        Spaces.deleteOffice(req.body._id, req.body.office_id, function(err) {
            if(!err) {
                res.status(200).end();
            } else {
                res.status(500).end(err);
            }
        })
    }
});

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
