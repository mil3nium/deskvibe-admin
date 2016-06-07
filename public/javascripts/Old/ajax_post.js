/**
 * Created by Mil3nIuM on 15.05.2016.
 */



function getHours() {
    var hours = [];
    $('#open_hour_list .days_open').each(function() {
        var open = $(this).find('input:checked')[0] ? true : false;
        hours.push({open: open, start: $(this).find('.hours_open option:selected').text(),
                    end: $(this).find('.hours_closed option:selected').text()});
    });
    return JSON.stringify(hours);
}

var venue_added = false;

function POST(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(venue, msg) {
            if(venue)
                venue_active = venue;

            venue_added = true;
            $('#venueModal').modal('hide');
            callback();
        },
        error: function(msg) {
            callback();
        }
    });
}



function POST_FORM(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function(venue, msg) {
            venue_active = venue;
            SUCCESS("Saved data");
            callback();
        },
        error: function(msg) {
            ERROR(msg);
        }
    });
}

function submit_info(_id) {
    if(validateEmail( $('#contact_email').val())){
        var data = {
            _id: _id,
            state: $('#state').val(),
            name: $('#name').val(),
            contact_name: $('#contact_name').val(),
            contact_email: $('#contact_email').val(),
            type: $('#type').val(),
            street: $('#street').val(),
            street_number: $('#street_number').val(),
            postal_code: $('#postal_code').val(),
            postal_town: $('#postal_town').val(),
            county: $('#county').val(),
            country: $('#country').val(),
            lat: $('#lat').val(),
            lng: $('#lng').val()
        };

        POST('/saveSpace', data);

    } else {
        alert("Email is wrong format");
    }
}

function delete_venue(id) {
    var conf = confirm("Are you sure you want to delete this : " + venue_list[id].name);

    if(conf == true) {
        $.ajax({
            url: 'deleteVenue',
            type: 'POST',
            dataType: 'json',
            data: {_id: venue_list[id]._id},
            success: function(venue, msg) {
                venue_list.splice(id, 1);
                var html = new EJS({url: '/Venue/Venue_list.ejs'});
                $('#main_content').html(html.render(html));
                SUCCESS("Deleted venue : " + id);
            },
            error: function(msg) {
                console.log(msg);
            }
        })
    } else {
        console.log("false");
    }
}

function submit_details() {
    var data = new FormData();

    if(venue_active._id != "") data.append('_id', venue_active._id);
    data.append('type', $('#type').val());
    data.append('expertise',$('#expertise').val());
    data.append('sqm', $('#sqm').val());
    data.append('description', $('#description').val());
    data.append('open_hours', getHours());

    POST_FORM('/saveData', data);
}

function submit_office(callback) {
    var data = new FormData();

    if(venue_active._id != "") data.append('_id', venue_active._id);
    if($('#office_id').val()) data.append('office_id', $('#office_id').val());
    data.append('office', "office");
    data.append('type', $('#office_type').find('option:selected').val());
    data.append('seats', $('#office_seats').val());
    data.append('description', $('#office_description').val());
    data.append('day', $('#office_price_day').val());
    data.append('week', $('#office_price_week').val());
    data.append('month', $('#office_price_month').val());
    
    POST_FORM('/saveData', data, callback);
}

function delete_office(id) {

    var conf = confirm("Are you sure you want to delete this : " + venue_active.offices[id].type);

    if(conf == true) {
        var data = {
            "_id": venue_active._id,
            'office_id': venue_active.offices[id]._id
        };

        POST('/deleteOffice', data, function() {
            venue_active.offices.splice(id, 1);
            var html = new EJS({url: '/Venue/Venue_offices.ejs'});
            $('#main_content').html(html.render(html));
        });
    }
}

function submit_amenities() {
    var data = new FormData();

    if(venue_active._id != "") data.append('_id', venue_active._id);
    data.append('tags', tags);
    data.append('amenities', getAmenities());

    POST_FORM('/saveData', data, function() {

    });
}
