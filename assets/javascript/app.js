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
      // console.log("Brewery list:", JSON.stringify(list));
      // iterate through each element from ajax query
      list.forEach(element => {
        // planning type breweries are not yet launched!
        if(element.brewery_type!=="planning") {
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
          var breweryPh  = $("<p>");

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
          console.log(element);
          // console.log(`Brewery name: ${element.name}`);
          // console.log(`Brewery type: ${element.brewery_type}`);
          // console.log(address);
        }
      });
    }
  });
}

// event handler for search
$('.addButton').click( () => {
  // gets search box input
  var searchInput = $(".searchBox").val().trim();
  console.log('searchInput', searchInput);
  // gets brewery based on searchInput
  getBreweries(searchInput);
});

// function for drawing map [WIP]
var mapThings = () => {
  var publicToken = "pk.eyJ1IjoiZnJlc2hndWF2YXMiLCJhIjoiY2szM3k3Y2tmMHJmYTNjczJiNDVnZzhvOCJ9.Ry3fBcfenPpbHq86OrbN0Q";
  mapboxgl.accessToken = publicToken;
  console.log('mapboxgl.accessToken', mapboxgl.accessToken);

  // variable to store map object
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 10,
  });

  // mapbox SDK, necessary for adding markers on the map
  var mapboxClient = mapboxSdk({accessToken: publicToken})

  $(document).on('click', '.brewery', () => {
    console.log('brewery clicked');
    console.log('this.data-address', $(this).attr('data-address'));
    var showFeature = () => {
      mapboxClient.geocoding.forwardGeocode({
        // query for location, going to have to pass a search in to place marker
        // query: '390 Capistrano Rd, Half Moon Bay, CA',
        query: $(this).attr('data-address'),
        autocomplete: false,
        // limit to 1 feature so there isn't a map full of markers :P
        limit: 1,
        
      }).send().then((response) => {
        console.log('response:', response);
        // if response exists and has a feature on the map
        if(response && response.body && response.body.features && response.body.features.length) {
          // feature is first returned element in list - address
          var feature = response.body.features[0];
    
          // center map on feature [WIP]
          // map.center = feature.center;
          // map zoom on feature [WIP]
    
          map.zoom = 10;
          // set marker on feature and add it to the map
          map.flyTo({
            center: feature.geometry.coordinates
          })
    
          new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
        }
      });
    }
    showFeature();
  });


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

  addUserLocationMarker();
  // showFeature();
}

mapThings();