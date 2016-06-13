/**
 * Created by Mil3nIuM on 11.05.2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * List over an space attributes, this is to make it easier to fetch data from the user while coding.
 * @type {mongoose.Account}
 */
var Venues = new Schema({
    id: Number,
    state: {type: [String], index: true},
    name: String,
    contact: {
        name: String,
        email: String
    },
    expertise: String,
    tags: [],
    type: String,
    sqm: Number,
    description: String,
    open_all_hours: Boolean,
    open_hours: [{_id: false, open: Boolean, day: String, start: String, end: String}],
    amenities: [],
    location: {
        formatted_address: String,
        street: String,
        street_number: Number,
        postal_code: Number,
        postal_town: String,
        county: String,
        country: String,
        lat: Number,
        lng: Number
    },
    offices: []
}, { collection: 'venues'});

var Office = new Schema({
    type: String,
    seats: String,
    description: String,
    amenities: [],
    hour: Number,
    day: Number,
    week: Number,
    month: Number
});

var Spaces = mongoose.model('Spaces', Venues);
var Offices = mongoose.model('Office', Office);

exports.getTemplate = function() {
    var space = new Spaces();
    space.type = "";
    space.expertise = "";
    space.sqm = 0;
    space.description = "";
    space.state = "";
    space.name = "";
    space.contact.name = "";
    space.contact.email = "";
    space.location = {
        formatted_address: "",
        street: "",
        street_number: "",
        postal_code: 0,
        postal_town: "",
        county: "",
        country: "",
        lat: 0,
        lng: 0
    };
    space.open_all_hours = false;
    space.open_hours = Empty_hours();
    space.offices = new Offices();
    space.amenities = [
        "Wi-Fi",
        "24/7",
        "Coffee/tea",
        "Meeting rooms",
        "Shared Kitchen",
        "Air condition",
        "Lockers",
        "Pets",
        "Wheelchair accessible"
    ]
    return space;
}

function Empty_hours() {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var data = [];
    for(var i = 0; i < 7; i++) {
        data.push( {open: false, day: days[i], start: "00:00", end: "00:00"} );
    }
    return data;
}

exports.getVenues = function(id, callback) {
    if(id != null) {
        Spaces.find({_id: id}, function(err, space) {
            if (!err) {
                callback(null, space);
            }else {
                callback(err, null);
            }
        });
    } else {
        Spaces.find({}, function(err, spaces) {
            if(!err) {
                callback(null, spaces);
            } else {
                callback(err, null);
            }
        })
    }
};

exports.saveVenue = function(venue, callback) {
    Spaces.findOneAndUpdate({_id: venue._id}, venue, {overwrite: true, upsert: true}, function(err, updatedVenue) {
        if(!err) {
            callback(null, updatedVenue);
        } else {
            callback(err, null);
        }
    })
}

exports.deleteVenue = function(_id, callback) {
    Spaces.remove({_id: _id}, function(err) {
        if(!err) {
            callback();
        } else {
            callback(err);
        }
    })
};