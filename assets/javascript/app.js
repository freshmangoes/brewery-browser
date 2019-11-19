/*
  GLOBAL VARIABLES
*/

// mapbox public api key
var publicToken = "pk.eyJ1IjoiZnJlc2hndWF2YXMiLCJhIjoiY2szM3k3Y2tmMHJmYTNjczJiNDVnZzhvOCJ9.Ry3fBcfenPpbHq86OrbN0Q";
mapboxgl.accessToken = publicToken;
// console.log('mapboxgl.accessToken', mapboxgl.accessToken);

// mapboxSDK variable
var mapboxClient = mapboxSdk({ accessToken: publicToken });

// variable to store map object, draws map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 10,
});

var currentMarkers = [];

var getBreweries = (searchParam) => {
  // URL for ajax query
  var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + searchParam;
  console.log('queryURL', queryURL);
  // empties brew-info div (old search results)
  $('.brew-info').empty();
  // ajax query
  $.ajax({
    url: queryURL,
    method: "GET",
    success: (data) => {
      var list = data;

      // iterate through each element from ajax query
      list.forEach(element => {

        // planning type breweries are not yet launched!
        if (element.brewery_type !== "planning") {

          // grabbing useful data about each brewery
          var address = `${element.street}, ${element.city}, ${element.state}`;
          var name = element.name;
          var type = element.brewery_type;
          var website = element.website_url;
          var phoneNo = element.phone;

          // jQuery element caching
          var breweryDiv = $("<div class='brewery'>");
          breweryDiv.attr("data-address", address);
          var breweryName = $("<h2>");
          var breweryType = $("<h5>");
          var breweryAddress = $("<p class='breweryAddress'>");
          var breweryWebsite = $("<a>");
          var breweryPh = $("<p>");

          // adding pertinent info to jQuery elements
          breweryName.text(name);
          breweryType.text(type);
          breweryAddress.text(address);
          breweryWebsite.text(website);
          breweryPh.text(`${phoneNo}`);
          breweryWebsite.attr('href', website);

          // append info to a container div
          breweryDiv.append(breweryName, breweryType, breweryAddress, breweryWebsite, breweryPh);
          breweryDiv.addClass("pb-5");

          // append container div to search results div
          $('.brew-info').append(breweryDiv);
          // debug
          console.log("data list element DEBUG::", element);
        }
      });
    }
  });
}

// function for user location
var userLocation = () => {
  // geolocator button
  var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });

  var addUserLocationMarker = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const userCoords = [position.coords.longitude, position.coords.latitude];
      new mapboxgl.Marker({
        color: '#0fff1b'
      }).setLngLat(userCoords).addTo(map);
      map.flyTo({
        center: userCoords,
        zoom: 14
      });
    });
  }
  // adds geolocator button to map client
  map.addControl(geolocate);
  // adds a marker on user location after loading the webpage
  addUserLocationMarker();
}

// SAFETY FIRST 
$(document).ready( function() {
  userLocation();

  // event handler for search
  $('.addButton').click( function() {
    // gets search box input
    var searchInput = $(".searchBox").val().trim();
    console.log('searchInput', searchInput);
    // gets brewery based on searchInput
    getBreweries(searchInput);
  });

  $(document).on("click", ".brewery", function() {
    var addressOnClick = $(this).attr('data-address');
    // debug
    console.log('addressOnClick DEBUG::', addressOnClick);
    // debug
    var clicked = $(this);
    console.log('DEBUG::', clicked);

    // takes in an address from a click event 
    var showFeature = (clickSearchQuery) => {

      if(currentMarkers) {
        currentMarkers.forEach(element => {
          element.remove();
        });
      }

      mapboxClient.geocoding.forwardGeocode({
        // query for location, going to have to pass a search in to place marker
        // query: '390 Capistrano Rd, Half Moon Bay, CA',
        query: clickSearchQuery,

        autocomplete: false,
        // limit to 1 feature so there isn't a map full of markers :P
        limit: 1,

      }).send().then((response) => {
        console.log('response:', response);
        // if response exists and has a feature on the map
        if (response && response.body && response.body.features && response.body.features.length) {
          // feature is first returned element in list - address
          var feature = response.body.features[0];

          // zoom on marker
          map.zoom = 20;
          // set marker on feature and add it to the map
          map.flyTo({
            center: feature.geometry.coordinates
          })
          var marker = new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
          currentMarkers.push(marker);
        }
      });
    }
    showFeature(addressOnClick);
  });
})
