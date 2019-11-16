var getBreweries = (searchParam) => {
  var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + searchParam;
  console.log('queryURL', queryURL);
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
          console.log('website', website)

          var breweryDiv = $("<div>");
          var breweryName = $("<h2>");
          var breweryType = $("<h5>");
          var breweryAddress = $("<p>");
          var breweryWebsite = $("<a>");
          
          breweryName.text(name);
          breweryType.text(type);
          breweryAddress.text(address);
          breweryWebsite.text(website);
          breweryWebsite.attr('href', website);
          breweryDiv.addClass("pb-5");
          breweryDiv.append(breweryName, breweryType, breweryAddress, breweryWebsite);
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