var getBreweries = (searchParam) => {
  var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + searchParam;
  console.log('queryURL', queryURL);
  $('.brew-info').empty();
  $.ajax({
    url: queryURL,
    method: "GET",
    success: (data) => {
      var list = data;
      // console.log("Brewery list:", JSON.stringify(list));
      list.forEach(element => {
        if(element.brewery_type!=="planning") {
          var address = `${element.street}, ${element.city}, ${element.state}`;
          var name = element.name;
          var type = element.brewery_type;
          var website = element.website_url;
          var phoneNo = element.phone;
          console.log('website', website)

          var breweryDiv = $("<div>");
          var breweryName = $("<h2>");
          var breweryType = $("<h5>");
          var breweryAddress = $("<p>");
          var breweryWebsite = $("<a>");
          var breweryPh  = $("<p>");

          
          breweryName.text(name);
          breweryType.text(type);
          breweryAddress.text(address);
          breweryWebsite.text(website);
          breweryPh.text(`Call: ${phoneNo}`);
          breweryWebsite.attr('href', website);

          breweryDiv.append(breweryName, breweryType, breweryAddress, breweryWebsite, breweryPh);
          breweryDiv.addClass("pb-5");
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

var logLocation = (position) => {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  console.log(`LAT: ${lat} | LONG: ${lon}`);
}

var getUserLocation = () => {
  if('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(logLocation);
  } else {
    console.log('geolocation not available');
  }
}