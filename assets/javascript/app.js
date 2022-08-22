/*
  GLOBAL VARIABLES
*/

// const firebaseConfig = {
//   apiKey: "AIzaSyCwMmet64yctVBHxeQAehsvzuAG778Mddg",
//   authDomain: "akc-project-1.firebaseapp.com",
//   databaseURL: "https://akc-project-1.firebaseio.com",
//   projectId: "akc-project-1",
//   storageBucket: "akc-project-1.appspot.com",
//   messagingSenderId: "699582870527",
//   appId: "1:699582870527:web:1a77fd19fc3080986fedca",
//   measurementId: "G-VTN9D03XFX"
// };

// firebase.initializeApp(firebaseConfig);

// var db = firebase.database();

// mapbox public api key
var publicToken =
  "pk.eyJ1IjoiZnJlc2hndWF2YXMiLCJhIjoiY2szM3k3Y2tmMHJmYTNjczJiNDVnZzhvOCJ9.Ry3fBcfenPpbHq86OrbN0Q";
mapboxgl.accessToken = publicToken;
// console.log('mapboxgl.accessToken', mapboxgl.accessToken);

// mapboxSDK variable
var mapboxClient = mapboxSdk({ accessToken: publicToken });

// variable to store map object, draws map
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 10
});

var currentMarkers = [];

var getBreweries = searchParam => {
  // URL for ajax query

  var city = searchParam;
  var queryURL =
    "https://api.openbrewerydb.org/breweries?by_postal=" + searchParam;
  console.log("queryURL", queryURL);
  // empties brew-info div (old search results)

  $(".brew-results").empty();
  // ajax query
  $.ajax({
    url: queryURL,
    method: "GET",
    success: data => {
      var list = data;

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

          var brewCard = $("<div class='card'>");
          var mapIt = $("<button id='map-it'>");
          var breweryName = $("<h5 class='card-header'>");
          var breweryType = $("<h6 class='card-subtitle'>");
          var breweryAddress = $("<p class='card-text'>");
          var breweryWebsite = $("<a class='card-link'>");
          var breweryPh = $("<p class='card-text'>");

          // adding pertinent info to jQuery elements
          mapIt.text("Map it!");
          mapIt.attr("data-address", address);
          breweryName.text(name);
          breweryType.text(type);
          breweryAddress.text(address);
          breweryWebsite.text(website);
          breweryPh.text(`${phoneNo}`);

          // append info to a container div

          //breweryDivTitle.append(breweryName);
          brewCard.append(
            breweryName,
            mapIt,
            breweryType,
            breweryAddress,
            breweryPh,
            breweryWebsite
          );
          //breweryDiv.append(breweryDivTitle, breweryDivBody);
          brewCard.addClass("pb-5");

          // append container div to search results div
          $(".brew-results").append(brewCard);
          console.log(element);
        }
      });
      // iterate through each element from ajax query

      // var getFirebaseBreweries = () => {
      //   db.ref().once("value", function(snapshot) {
      //     console.log("Snapshot:", snapshot);
      //     snapshot.forEach(childSnap => {
      //       var childKey = childSnap.key;
      //       console.log("childKey", childKey);

      //       var childRef = db.ref(childKey);
      //       childRef.once("value", function(snapshot) {
      //         console.log(snapshot.val().address);
      //         var childAddress = snapshot.val().address;
      //         if (childAddress.includes(city)) {
      //           console.log("contains city");
      //           var brewCard = $("<div class='card'>");
      //           var mapIt = $("<button id='map-it'>");
      //           var breweryName = $("<h5 class='card-header'>");
      //           var breweryType = $("<h6 class='card-subtitle'>");
      //           var breweryAddress = $("<p class='card-text'>");
      //           var breweryWebsite = $("<a class='card-link'>");
      //           var breweryPh = $("<p class='card-text'>");

      //           breweryName.text(snapshot.val().name);
      //           breweryType.text(snapshot.val().type);
      //           breweryAddress.text(snapshot.val().address);
      //           breweryWebsite.text(snapshot.val().website);
      //           breweryPh.text(snapshot.val().phone);

      //           mapIt.text("Map it!");
      //           mapIt.attr("data-address", snapshot.val().address);

      //           brewCard.append(
      //             breweryName,
      //             mapIt,
      //             breweryType,
      //             breweryAddress,
      //             breweryPh,
      //             breweryWebsite
      //           );
      //           //breweryDiv.append(breweryDivTitle, breweryDivBody);
      //           brewCard.addClass("pb-5");

      //           // append container div to search results div
      //           $(".brew-results").append(brewCard);
      //         } else {
      //           console.log("doesn't");
      //         }
      //       });
      //     });
      //   });
      // };
      // getFirebaseBreweries();
    }
  });
};

// event handler for search
$(".search-btn").click(() => {
  // gets search box input
  var searchInput = $(".searchBox")
    .val()
    .trim();
  console.log("searchInput", searchInput);
  // gets brewery based on searchInput
  getBreweries(searchInput);
});

// function for user location
var getUserLocation = () => {
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
        color: "#0fff1b"
      })
        .setLngLat(userCoords)
        .addTo(map);
      map.flyTo({
        center: userCoords,
        zoom: 14
      });
    });
  };
  // adds geolocator button to map client
  map.addControl(geolocate);
  // adds a marker on user location after loading the webpage
  addUserLocationMarker();
};

// SAFETY FIRST
$(document).ready(function() {
  getUserLocation();

  // event handler for search
  $(".addButton").click(function() {
    // gets search box input
    var searchInput = $(".searchBox")
      .val()
      .trim();
    console.log("searchInput", searchInput);
    // gets brewery based on searchInput
    getBreweries(searchInput);
  });

  $(document).on("click", "#map-it", function() {
    var addressOnClick = $(this).attr("data-address");
    // debug
    console.log("addressOnClick DEBUG::", addressOnClick);
    // debug
    var clicked = $(this);
    console.log("DEBUG::", clicked);

    // takes in an address from a click event
    var showFeature = clickSearchQuery => {
      if (currentMarkers) {
        currentMarkers.forEach(element => {
          element.remove();
        });
      }

      mapboxClient.geocoding
        .forwardGeocode({
          // query for location, going to have to pass a search in to place marker
          // query: '390 Capistrano Rd, Half Moon Bay, CA',
          query: clickSearchQuery,

          autocomplete: false,
          // limit to 1 feature so there isn't a map full of markers :P
          limit: 1
        })
        .send()
        .then(response => {
          console.log("response:", response);
          // if response exists and has a feature on the map
          if (
            response &&
            response.body &&
            response.body.features &&
            response.body.features.length
          ) {
            // feature is first returned element in list - address
            var feature = response.body.features[0];

            // zoom on marker
            map.zoom = 20;
            // set marker on feature and add it to the map
            map.flyTo({
              center: feature.geometry.coordinates
            });
            var marker = new mapboxgl.Marker()
              .setLngLat(feature.center)
              .addTo(map);
            currentMarkers.push(marker);
          }
        });
    };
    showFeature(addressOnClick);
  });

  $("#submit-btn").click(function(event) {
    event.preventDefault();
    var name = $("#name-input")
      .val()
      .trim();
    var address = $("#address-input")
      .val()
      .trim();
    var phone = $("#phone-input")
      .val()
      .trim();
    var type = $("#type-input")
      .val()
      .trim();
    var website = $("#website-input")
      .val()
      .trim();

    console.log(`
      name:: ${name}
      address:: ${address}  
      phone:: ${phone}
      type:: ${type}
      website:: ${website}
    `);

    db.ref().push({
      name,
      address,
      phone,
      type,
      website
    });
  });

  //firebase watcher
  // db.ref().on("child_added", function(snap) {
  //   var snapshot = snap.val();
  //   console.log(`Name: ${snapshot.name}`);
  //   console.log(`Address: ${snapshot.address}`);
  //   console.log(`Phone: ${snapshot.phone}`);
  //   console.log(`Type: ${snapshot.type}`);
  //   console.log(`Website: ${snapshot.website}`);
  // });
});
