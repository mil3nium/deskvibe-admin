/**
 * Created by Mil3nIuM on 14.05.2016.
 */

var apiKey = "AIzaSyCmNSL6HgFcjoxc9ae8CUy0auroSoYypzM";

function GoogleGetGeodata(searchString, callback) {
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ searchString + "+" + $('#search_country').val() + "&key="+apiKey+"&sensor=false&language=en",
        function(data, textStatus){
            if(data.status === "OK") {
                callback(data);
            } else {
                callback(false);
            }
        });
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
