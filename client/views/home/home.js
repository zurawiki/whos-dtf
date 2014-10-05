var map, markers = [];

Template.home.events({
    'change #horny': function () {
        if (Session.get('latLng') == null) {
            var latLng = Geolocation.latLng();

            if (!latLng) {
                return;
            }
            Session.set('latLng', latLng);

        }

        val = document.querySelector('#horny').value;
        Session.set("quant", val);
        Meteor.users.update(
            Meteor.userId(),
            {$set: {
                'marker': {
                    lat: latLng.lat,
                    lng: latLng.lng,
                    val: val
                },
                'visible': true
            }

            }
        );
        if (val == 0) {
            Meteor.users.update(
                Meteor.userId(),
                {$set: {'visible': false}}
            );
        }


    }
})
;

Template.home.quant = function () {
    return Session.get("quant") || '0';
};


///////////////////////////////////////////////////////////////////////////////
// Map display

Template.map.helpers({
    markers: Meteor.users.find({'visible': true})

});

Template.map.rendered = function () {
    $(function () {
        $(window).resize(function () {
            $('#map').css('height', window.innerHeight);
        });
        $(window).resize(); // trigger resize event
    });
    var styleSettings = [
        {
            stylers: [
                { visibility: 'simplified' },
                { gamma: 0.5 },
                { weight: 0.5 }
            ]
        },
        {"featureType": "water", "stylers": [
            {"color": "#021019"}
        ]},
        {"featureType": "landscape", "stylers": [
            {"color": "#08304b"}
        ]},
        {"featureType": "poi", "elementType": "geometry", "stylers": [
            {"color": "#0c4152"},
            {"lightness": 5}
        ]},
        {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [
            {"color": "#000000"}
        ]},
        {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [
            {"color": "#0b434f"},
            {"lightness": 25}
        ]},
        {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [
            {"color": "#000000"}
        ]},
        {"featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [
            {"color": "#0b3d51"},
            {"lightness": 16}
        ]},
        {"featureType": "road.local", "elementType": "geometry", "stylers": [
            {"color": "#000000"}
        ]},
        {"elementType": "labels.text.fill", "stylers": [
            {"color": "#ffffff"}
        ]},
        {"elementType": "labels.text.stroke", "stylers": [
            {"color": "#000000"},
            {"lightness": 13}
        ]},
        {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [
            {"color": "#000000"}
        ]},
        {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [
            {"color": "#144b53"},
            {"lightness": 14},
            {"weight": 1.4}
        ]}
    ];


    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(42.36, -71.09),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styleSettings,
        backgroundColor: "#021019"

    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    GeoMarker = new GeolocationMarker();
    GeoMarker.setCircleOptions({fillColor: '#808080'});

    google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function () {
        map.setCenter(this.getPosition());
    });

    google.maps.event.addListener(GeoMarker, 'geolocation_error', function (e) {
        alert('There was an error obtaining your position. Message: ' + e.message);
    });

    GeoMarker.setMap(map);

    function getCustomRadiusForZoom(z) {
        return 20 * (0.25) ^ (z - 14);
    }

    //  google.maps.event.addListener(map, 'zoom_changed', function() {
    //   var zoomLevel = map.getZoom();
    //   _.each(markers, function(c) {
    //       c.setOptions(
    //         {radius: getCustomRadiusForZoom(zoomLevel)}
    //         );
    //   });
    // });

    var query = Meteor.users.find({
        visible: true
    });

    function addMarker(u) {
//        console.log("adding marker: ", u.marker);
        var marker = new google.maps.Marker(u.marker);
        icon = {
            sacledSize: new google.maps.Size(32, 32),
            url: 'http://www.rozu.co/blog/wp-content/uploads/2014/10/marker-' + u.marker.val + '.png'
        };

        if (u._id === Meteor.userId()) {
            marker.setOptions({
                animation: google.maps.Animation.DROP,
                position: u.marker,
                map: map,
                icon: icon,
                _id: u._id

//                url: "/user/#{u._id}"

            });
        } else {
            marker.setOptions({
                animation: google.maps.Animation.DROP,
                map: map,
                position: u.marker,
                icon: icon,
                _id: u._id
//                url: "/user/#{u._id}"

            });
        }

        //   var zoomLevel = map.getZoom();
        //
        //   var populationOptions = {
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.8,
        //     strokeWeight: 2,
        //     fillColor: '#FF0000',
        //     fillOpacity: 0.35,
        //     map: map,
        //     center: l,
        //     radius: getCustomRadiusForZoom(zoomLevel)
        //   };
        // // Add the circle for this city to the map.
        // marker = new google.maps.Circle(populationOptions);

        google.maps.event.addListener(marker, 'mousedown', function () {
            Router.go('user', {_id: u._id});
        });

        markers.push(marker)
//        console.log("markers", markers);
    }

    query.observe({
            added: function (u) {
                addMarker(u);
            },
            changed: function (u) {
                marker = _.findWhere(markers, {_id: u._id});
//                console.warn(marker);

                marker.setMap(null);
                markers = _.without(markers, marker);

                addMarker(u);
            },

            removed: function (u) {
                marker = _.findWhere(markers, {_id: u._id});
//                console.warn(marker);

                marker.setMap(null);
                markers = _.without(markers, marker);
            }
        }
    );
};
Template.map.destroyed = function () {
    _.each(markers, function (marker) {
        marker.setMap(null);
    });
    markers = [];
};
