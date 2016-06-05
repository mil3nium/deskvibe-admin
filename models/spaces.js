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
    open_hours: [{_id: false, open: Boolean, start: String, end: String}],
    amenities: [],
    location: {
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
    space.location = "";
    space.open_hours = Empty_hours();
    return space;
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
                var spaceMap = [];

                spaces.forEach(function(space) {
                    spaceMap.push({_id: space._id, name: space.name, description: space.description});
                });

                callback(null, spaces);
            } else {
                callback(err, null);
            }
        })
    }
};

exports.saveVenue = function(venue, callback) {
    if(venue._id != "") {
        Spaces.findOneAndUpdate({_id: venue._id}, venue, {overwrite: true, upsert: true}, function(err, updatedVenue) {
            if(!err) {
                if(updatedVenue)
                    callback();
            } else {
                callback(err);
            }
        })
    }
}

exports.addSpace = function(_id, state, name, contact_name, contact_email, street, street_number, postal_code, postal_town,
                            county, country, lat, lng, callback) {
    
    if(state && name && contact_name && contact_email && street && street_number && postal_code && postal_town &&
        county && country && lat && lng ) {
        console.log(state);
        var location = {
            street: street,
            street_number: street_number,
            postal_code: postal_code,
            postal_town: postal_town,
            county: county,
            country: country,
            lat: lat, lng: lng};
        console.log(_id);
        if(_id != "") {
            Spaces.findOne({_id: _id}, function(err, space) {
                if(!err) {
                    space.state[0] = state;
                    space.name = name;
                    space.contact.name = contact_name;
                    space.contact.email = contact_email;
                    space.location = location;

                    space.save(function(err) {
                        if(!err) {
                            callback(null, space);
                        } else {
                            callback("500: Internal server error : Could not save data : " + err, null);
                        }
                    });
                } else {
                    callback("400: No venues with that ID: " + err, null);
                }
            })
        } else {
            var space = new Spaces();
            space.type = "";
            space.expertise = "";
            space.sqm = 0;
            space.description = "";
            space.state = state;
            space.name = name;
            space.contact.name = contact_name;
            space.contact.email = contact_email;
            space.location = location;
            space.open_hours = Empty_hours();

            space.save(function(err) {
                if(!err) {
                    callback(null, space);
                } else {
                    callback("500: Internal server error : Could not save data : " + err, null);
                }
            });
        }
    } else {
        callback("400: Bad request : Some of the data was NULL. Try again with correct data.");
    }
};

exports.saveData = function (_id, dataList, callback) {
    if(_id && _id != "") {
        Spaces.findOne({_id: _id}, function(err, space) {
            dataList.forEach(function(data, i) {
                    space[data.fieldname] = data.val;
            });

            space.save(function(err) {
                if(!err) {
                    callback(null, space);
                } else {
                    callback(err, null);
                }
            });

        });
    } else {
        callback("ID is null", null);
    }
};

function saveOfficeData(_id, office, dataList, callback) {

    Spaces.findOne({_id: _id}, function(err, space) {
        if(!err ) {
            dataList.forEach(function(data, i) {
                console.log(data.fieldname + " = " + data.val);
                office[data.fieldname] = data.val;
            });

            space.offices.push(office);
            space.save(function(err) {
                if(!err) {
                    callback(null, space);
                } else {
                    console.log(err);
                    callback(err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
}

exports.saveOffice = function(_id, dataList, callback) {

    if(_id && _id != "") {
        if(dataList[0].fieldname !== "office_id"){
            var office = new Offices();
            saveOfficeData(_id, office, dataList, callback);
        } else {
            Spaces.findOne({'_id': _id}, function(err, venue) {
                    if(!err) {
                        venue.offices.forEach(function(office, i) {
                            if(office._id = dataList[0].val) {
                                venue.offices.splice(i, 1);

                                venue.save(function(err) {
                                    if(!err) {
                                        var office = new Offices();
                                        saveOfficeData(_id, office, dataList, callback);
                                    } else {
                                        callback(err);
                                    }
                                });
                            }
                        });
                    } else {
                        callback(err, null);
                    }
                });
        }
    } else {
        callback("ID is null", null);
    }
};

exports.deleteOffice = function(_id, office_id, callback) {
    if(_id && office_id) {
        Spaces.findOne({'_id': _id}, function(err, venue){

            var offices = venue.offices;

            offices.forEach(function(office, i) {
                if(office._id == office_id) {
                    offices.splice(i, 1);
                    venue.offices = offices;
                    venue.save(function(err, venue) {
                        if(!err) {
                            callback(null, venue);
                        } else {
                            callback(err, null);
                        }
                    })
                }
            }, function(){
                callback("No office match");
            });
        });
    } else {
        callback("ID is NULL");
    }
};

function Empty_hours() {
    var data = [];
    for(var i = 0; i < 7; i++) {
        data.push( {open: false, start: "0:00", end: "0:00"} );
    }
    return data;
}


