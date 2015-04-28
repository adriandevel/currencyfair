var JACKET_HEIGHT_PX = 80, JACKET_WIDTH_PX = 75;  // Book cover image
var MAP_OFFSET_HEIGHT_PX = -50, MAP_OFFSET_WIDTH_PX = 0;  // Info-window map offsets

var map;
var mapData = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
var numPopups = 7;
var zoomLevel = 4;
var loopNumber = 0;
var lastTimeoutId = null;
var all_countries;
var countLogs = 0;

$(document).ready(function() {
	//all_countries = JSON.parse(countries);
	var socket = io();
    
	drawMap();
	
	//show raw messages
	socket.on('queue-size', function(msg){
		console.log(msg);
		show_queue(msg);
    });

	//show raw messages
	socket.on('raw-message', function(msg){
		show_log(msg);
    });

	//add poupup on the map
    socket.on('new-transaction', function(msg){
    	var logs = JSON.parse(msg);
    	$.each( logs, function( key, obj ) {
	        var country = alasql('SELECT * FROM ? WHERE ISO3136="'+ obj.country +'"',[centroids]);
			var selected_country = country[0];
			data = {}
			data.country = selected_country.ISO3136;
			data.displayName = selected_country.SHORT_NAME;
			data.count = obj.count;
			data.Latitude = selected_country.LAT;
			data.Longitude = selected_country.LONG;
			mapCallback(data);
		});
    });
	
});

//prepend log to raw log section
function show_log(log){
	if(log != null)
		$('#logMessages').prepend('<div class="message">'+ log +'</div>');
}

//whow queue suze
function show_queue(size){
	$('#queueSize').html(size);
}

//draw the world map
function drawMap() {
    map = L.map('map', {
    	scrollWheelZoom: false,
        doubleClickZoom: false,
        closePopupOnClick: true})
    .setView([sStartLat,sStartLng], zoomLevel)
    .setMaxBounds(L.latLngBounds([100, -250], [-100, 250]));

    L.tileLayer(sImageDir + 'map_images/watercolor_map/{z}/{x}/{y}.jpg', {
        attribution: 'Tiles by Stamen Design (CC BY 3.0). Data by OpenStreetMap (CC BY SA).',
        minZoom: 2,
        maxZoom: 6,
    }).addTo(map);

    countryLayer = L.geoJson(countries,  {
        style: {
            weight: 1,
            opacity: 0.5,
            color: '#555',
            fillOpacity: 0
        },
    }).addTo(map);

}

//manage popups
function mapCallback(data) {
	setTimeout(function(){
		var maxPopup = numPopups - 1;

		// Remove oldest marker
		if (mapData[0] != null) {
			map.closePopup(mapData[0]);
		}
		// Rotate popups
		for (var n = 0; n < maxPopup; n++) {
			mapData[n] = mapData[n + 1];
		}
		// Insert new popup
		mapData[maxPopup] = newPopup(data);
		// If we have have called setTimeout before, clear the timeout before setting another
		if (lastTimeoutId !== null) {
			window.clearTimeout(lastTimeoutId);
		}
	}, 700);
	
}


function newPopup(data) {
	if ( data.country != null ) {
		var displayName = data.displayName;
		var total = data.count;
		var point = new L.latLng(data.Latitude, data.Longitude);
		var html = createHtml(displayName, total);
		var popup = createPopup(point, html);
		return popup;
	}

	return null;
}


function createHtml(countryName, total) {
	var plural = (total > 1) ? 's': '';
	var html = '<span class="LiveMapPopup" id="ln' + loopNumber + '">';

	html += '<span>'
		+ '<span>'+ total +' new transaction'+ plural +' from ' + countryName + '</span>'
		+ '</span>'
		+ '</span>'
		+ '</span>';
	return html;
}


function createPopup(point, html) {
    var popup = L.popup({
        autoPan:false,
        closeButton:false
        })
        .setContent(html)
        .setLatLng(point);
    popup.addTo(map);
    map.panTo(point);
	map.panBy([MAP_OFFSET_WIDTH_PX, MAP_OFFSET_HEIGHT_PX]);
    return popup;
}

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}
 
//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}
 
//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}