'use strict'
var map;
var lat;
var lng;
var marker;
var markerPos;

$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            console.log("lat,lng", lat, lng);

            map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: lat,
                    lng: lng
                },
                zoom: 16
            });
            markerPos = new google.maps.LatLng(lat, lng);
            marker = new google.maps.Marker({
                position: markerPos,
                title: "",
                draggable: true
            });

            marker.setMap(map);

            google.maps.event.addListener(marker, 'dragend', function(ev) {
                console.log(ev.latLng.lat(), ev.latLng.lng());
            });
        },
        function() {
            alert("Geolocation Error");
        });

});
