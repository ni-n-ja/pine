'use strict'
var map;
var map2;
var usr;
var target;
var frends;
var now;
var timeText;
var timeDiff;

$(document).ready(function () {
    //$("#second").css("display", "none");
    usr = {
        lat: 35.652414,
        lng: 139.545242,
        markerPos: null,
        marker: null,
        marker2: null
    };

    now = new Date();
    timeText = document.getElementById('time');

    target = {
        lat: 35.65576882190963,
        lng: 139.54202812824178,
        markerPos: null,
        marker: null,
        marker2: null,
        time: now.getTime() + 3671000
    };

    navigator.geolocation.getCurrentPosition(function (position) {
        usr.lat = position.coords.latitude;
        usr.lng = position.coords.longitude;
        console.log("lat,lng", usr.lat, usr.lng);

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: usr.lat,
                lng: usr.lng
            },
            zoom: 16
        });

        map2 = new google.maps.Map(document.getElementById('map2'), {
            center: {
                lat: usr.lat,
                lng: usr.lng
            },
            zoom: 16
        });

        usr.marker = new google.maps.Marker({
            position: new google.maps.LatLng(usr.lat, usr.lng),
            title: "",
            draggable: true,
            map: map
        });

        target.marker = new google.maps.Marker({
            position: new google.maps.LatLng(target.lat, target.lng),
            title: "",
            draggable: false,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            map: map
        });

        usr.marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(usr.lat, usr.lng),
            title: "",
            draggable: true,
            map: map2
        });

        target.marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(target.lat, target.lng),
            title: "",
            draggable: false,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            map: map2
        });
        google.maps.event.addListener(usr.marker, 'dragend', function (ev) {
            console.log(ev.latLng.lat(), ev.latLng.lng());
        });
    },
        function () {
            alert("Geolocation Error");
        });
    anime();
});

function anime() {
    now = new Date();
    timeDiff = Math.floor((target.time - now.getTime()) / 1000);
    timeText.innerHTML = "到着まで<br>" + Math.floor(timeDiff / 3600) + "時間" + Math.floor(timeDiff % 3600 / 60) + "分";
    requestAnimationFrame(anime);
}
