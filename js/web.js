'use strict'
var map;
var usr;
var target;
var frends;
var now;
var timeText;
var timeDiff;

$(document).ready(function () {
    usr = {
        lat: 35.652414,
        lng: 139.545242,
        markerPos: null,
        marker: null
    };

    now = new Date();
    timeText = document.getElementById('time');

    target = {
        lat: 35.65576882190963,
        lng: 139.54202812824178,
        markerPos: null,
        marker: null,
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

var acceleration_x, acceleration_y, acceleration_z; //加速度
var shakeFlag_x = 0; //0でマイナスに降ってるとき，1でプラスに降っているとき
var shakeCount = 0;
var direction = 0; //方位角
var lat, lng = 0; //緯度経度
var distance = 0;
var touchNow = 0;
var targetLat;
var targetLng;

var req = new XMLHttpRequest();
req.responseType = 'text';
//var url = 'http://hacku.kinmemodoki.net'
var url = 'https://gnavi-rest-kinmemodoki.c9users.io/?_c9_id=livepreview0&_c9_host=https://ide.c9.io';
req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
        $("#m1").css('display', 'none');
        $("#result").css('display', 'block');
        document.getElementById("name").innerText = JSON.parse(req.response)["data"]["name"];
        document.getElementById("at").innerText = JSON.parse(req.response)["data"]["address"];
        targetLat = JSON.parse(req.response)["data"]["latitude"];
        targetLng = JSON.parse(req.response)["data"]["longitude"];
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            console.log("lat,lng", lat, lng);
            console.log("target lat,lng", targetLat, targetLng);
            document.getElementById("distance").innerText = mLatLon.get(
                mLatLon.getLatM(lat), mLatLon.getLonM(lng),
                mLatLon.getLatM(targetLat), mLatLon.getLonM(targetLng)) + "m";
        },
            function () {
                alert("Geolocation Error")
            });
        window.addEventListener('deviceorientation', function (event) {
            direction = event.alpha; // event.alphaで方角の値を取得
            //document.getElementById("connpas").innerText = aziCalc(lat, lng, targetLat, targetLng);
            $("#ga").css("transform", "rotate(" + aziCalc(lat, lng, targetLat, targetLng) + "deg)");
            aziCalc(lat, lng, targetLat, targetLng)
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                document.getElementById("distance").innerText = mLatLon.get(
                    mLatLon.getLatM(lat), mLatLon.getLonM(lng),
                    mLatLon.getLatM(targetLat), mLatLon.getLonM(targetLng)) + "m";
            },
                function () {
                    alert("Geolocation Error")
                });
        });
    }
};

function geoDirection(lat1, lng1, lat2, lng2) {
    // 緯度経度 lat1, lng1 の点を出発として、緯度経度 lat2, lng2 への方位
    // 北を０度で右回りの角度０～３６０度
    var Y = Math.cos(lng2 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    var X = Math.cos(lng1 * Math.PI / 180) * Math.sin(lng2 * Math.PI / 180) - Math.sin(lng1 * Math.PI / 180) * Math.cos(lng2 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
    if (dirE0 < 0) {
        dirE0 = dirE0 + 360; //0～360 にする。
    }
    var dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向
    return dirN0;
}

function aziCalc(userLat, userLng, shopLat, shopLng) {
    return -geoDirection(userLat, userLng, shopLat, shopLng) + direction;
}

(function () {
    var _u = undefined;
    var __u = "undefined";
    var global = (global == _u) ? window : global;
    var scope = {};
    global.mLatLon = scope;
    var _latitudeM = 0.000009013374140874493
    var _longitudeM = 0.000011003298110363172;
    var _getLatM = function (lat) {
        return (lat / _latitudeM) | 0;
    }
    var _getLonM = function (lon) {
        return (lon / _longitudeM) | 0;
    }
    var _get = function (ax, ay, bx, by) {
        ax = ax | 0;
        ay = ay | 0;
        bx = bx | 0;
        by = by | 0;

        // 精度はあまり高めでないが、高速で近似値を計算できる.
        var dx, dy;
        if ((dx = (ax > bx) ? ax - bx : bx - ax) < (dy = (ay > by) ? ay - by : by - ay)) {
            return (((dy << 8) + (dy << 3) - (dy << 4) - (dy << 1) +
                (dx << 7) - (dx << 5) + (dx << 3) - (dx << 1)) >> 8);
        } else {
            return (((dx << 8) + (dx << 3) - (dx << 4) - (dx << 1) +
                (dy << 7) - (dy << 5) + (dy << 3) - (dy << 1)) >> 8);
        }
    }

    var _getF = function (ax, ay, bx, by) {
        return _get(
            _getLatM(ax), _getLonM(ay),
            _getLatM(bx), _getLonM(by)
        );
    }

    scope.getLatM = _getLatM;
    scope.getLonM = _getLonM;
    scope.get = _get;
    scope.getF = _getF;

    /**
      mLatLon.get(
          mLatLon.getLatM( 35.664609 ),mLatLon.getLonM( 139.730985 ), // 六本木駅
          mLatLon.getLatM( 35.66150837264277 ),mLatLon.getLonM( 139.7295069694519 ) // 六本木ヒルズ
      )
     **/

})();
