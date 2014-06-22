//
//
//function initialize() {
//  var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
//  var mapOptions = {
//    zoom: 4,
//    center: myLatlng
//  };
//
//  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//
//  var contentString = '<div id="content">'+
//      '<div id="siteNotice">'+
//      '</div>'+
//      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//      '<div id="bodyContent">'+
//      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//      'sandstone rock formation in the southern part of the '+
//      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//      'south west of the nearest large town, Alice Springs; 450&#160;km '+
//      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//      'Aboriginal people of the area. It has many springs, waterholes, '+
//      'rock caves and ancient paintings. Uluru is listed as a World '+
//      'Heritage Site.</p>'+
//      '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//      'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//      '(last visited June 22, 2009).</p>'+
//      '</div>'+
//      '</div>';
//
//  var infowindow = new google.maps.InfoWindow({
//      content: contentString,
//      maxWidth: 200
//
//      
//  });
//
//  var marker = new google.maps.Marker({
//      position: myLatlng,
//      map: map,
//      title: 'Uluru (Ayers Rock)'
//  });
//  google.maps.event.addListener(marker, 'click', function() {
//    infowindow.open(map,marker);
//  });
//}

var map;
var directionsDisplay;
var directionsService;
var stepDisplay;
var markerArray = [];

function initialize() {
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  // Create a map and center it on Manhattan.
  var manhattan = new google.maps.LatLng(40.7711329, -73.9741874);
  var mapOptions = {
    zoom: 13,
    center: manhattan
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create a renderer for directions and bind it to the map.
  var rendererOptions = {
    map: map
  }
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
}

function calcRoute() {

  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Now, clear the array itself.
  markerArray = [];

  // Retrieve the start and end locations and create
  // a DirectionsRequest using WALKING directions.
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
  };

  // Route the directions and pass the response to a
  // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var warnings = document.getElementById('warnings_panel');
      warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      directionsDisplay.setDirections(response);
      showSteps(response);
    }
  });
}

function showSteps(directionResult) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_location,
      map: map
    });
    attachInstructionText(marker, myRoute.steps[i].instructions);
    markerArray[i] = marker;
  }
}

function attachInstructionText(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on,
    // containing the text of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}


google.maps.event.addDomListener(window, 'load', initialize);