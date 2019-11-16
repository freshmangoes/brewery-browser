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
          var breweryDiv = $("<div>");
          var breweryName = $("<h2>");
          var breweryType = $("<h5>");
          var breweryAddress = $("<p>");
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

// logs user location - TO BE USED LATER
var logLocation = (position) => {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  console.log(`LAT: ${lat} | LONG: ${lon}`);
}

// gets user coordinates, callback function is logLocation for now
var getUserLocation = () => {
  if('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(logLocation);
  } else {
    console.log('geolocation not available');
  }
}