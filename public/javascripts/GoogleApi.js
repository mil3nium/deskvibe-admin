/**
 * Created by Mil3nIuM on 14.05.2016.
 */

function GoogleGetGeodata(searchString, callback) {
    $.ajax({
        url: '/getGoogleData',
        type: 'POST',
        dataType: 'json',
        data: {googleAddress: searchString},
        success: function(address) {
            callback(address);
        },
        error: function(msg) {
            console.log(msg);
            callback(false);
        }
    });

    /*
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ searchString + "+" + $('#search_country').val() + "&language=en&key=AIzaSyCmNSL6HgFcjoxc9ae8CUy0auroSoYypzM",
        function(data, textStatus){
            if(data.status === "OK") {
                callback(data);
            } else {
                callback(false);
            }
        });
        */
}

function GetData() {
    $('#search_text').blur();
    GoogleGetGeodata($('#search_text').val(), function(data) {
        if(data) {
            addressList = data.results;
            $('#search-results').html("");
            $.each( data.results, function(i, place) {
                $('#search-results').append(createResultList(i, place.formatted_address));
            });
            $('#listModal').modal('show');
        } else {
            console.error("No data from google servers");
        }
    });
}
