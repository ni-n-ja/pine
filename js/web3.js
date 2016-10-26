'use strict'

var x, y;
var direction = 0; //方位角
var lat, lng = 0; //緯度経度
var distance = 0;
var touchNow = 0;
var targetLat;
var targetLng;

var req = new XMLHttpRequest();
req.responseType = 'text';
var url = 'http://hacku.kinmemodoki.net';
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

$(document).ready(function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        console.log("lat,lng", lat, lng);
    },
        function () {
            alert("Geolocation Error")
        });

    $(".next").click(function (event) {
        console.log("!!!");
        $(this).parent("div").css('display', 'none');
        $(this).parent().next().css('display', 'block');
        if ($(this).parent().next().attr("id") === "m1") {
        }
    });
    anime();
});

function anime() {
    window.requestAnimationFrame(anime);
}

function geoDirection(lat1, lng1, lat2, lng2) {
    var Y = Math.cos(lng2 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    var X = Math.cos(lng1 * Math.PI / 180) * Math.sin(lng2 * Math.PI / 180) - Math.sin(lng1 * Math.PI / 180) * Math.cos(lng2 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    var dirE0 = 180 * Math.atan2(Y, X) / Math.PI;
    if (dirE0 < 0) {
        dirE0 = dirE0 + 360;
    }
    var dirN0 = (dirE0 + 90) % 360;
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
