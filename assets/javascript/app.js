var listBreweries = () => {
  var getIP = () => {
    // ajax call to get user IP address
    $.ajax({
      url: "//api.ipify.org/?format=json",
      method: 'GET',
      dataType: 'JSON',
      success: (data) => {
        var userIP = data.ip;
        console.log(`userIP: ${userIP}`);
        // call to get location JSON object
        getLocationObj(userIP);
      },
    });
  }

  var getLocationObj = (userIP) => {
    // get user location based on IP address
    $.ajax({
      url: "http://api.ipstack.com/" + userIP + "?access_key=" + ipStackKey,
      method: "GET",
      dataType: "JSON",
      success: (data) => {
        // save JSON obj 
        var locationObj = data;
        // logging certain useful parts of the object
        console.log(`ZIP: ${locationObj.zip}`);
        console.log(`Lat: ${locationObj.latitude}`);
        console.log(`Longitude: ${locationObj.longitude}`);
        console.log(`City, State: ${locationObj.city}, ${locationObj.region_code}`);
        console.log(JSON.stringify(locationObj));
        // call to get list of breweries JSON object
        getBreweries(locationObj);
      },
    });
  }

  var getBreweries = (searchParam) => {
    // get list of breweries
    $.ajax({
      // test URL, search type will be determined by user
      url: "https://api.openbrewerydb.org/breweries?" + "by_city=" + searchParam.city,
      method: "GET",
      success: (data) => {
        // save JSON obj
        var breweryList = data;
        console.log(JSON.stringify(breweryList));
        // return the list of breweries JSON object
        return breweryList;
      }
    });
  }


  getIP();
}

var pullHTML = (searchParam) => {
  $.ajax({
    url: searchParam,
    method: "GET",
    dataType: "html",
    crossDomain: "true",
    success: (data) => {
      var result = data;
      console.log(`DATA: ${result}`);
    },
  });


}
var showLocation = (position) => {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  console.log(`LAT: ${lat}, LONG: ${lon}`);
}

var getLocation = () => {
  if (navigator.gelocation) {
    navigator.geolocation.getCurrentPosition(showLocation)
  } else {
    console.log("Browser does not support geolocation!");
  }
}
listBreweries();





