var getBreweries = (searchParam) => {
  $.ajax({
    url: "https://api.openbrewerydb.org/breweries?" + "by_city=" + searchParam,
    method: "GET",
    success: (data) => {
      var list = data;
      console.log("Brewery list:", JSON.stringify(list));
    }
  });
}