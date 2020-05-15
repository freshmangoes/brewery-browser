# Brewery Browser
A simple, single page web application designed to make finding a brewery or alehouse, in a target location, an easy experience. 

Written in vanilla HTML, CSS, Javascript, and jQuery. Makes use of Firebase, Mapbox CDN/APIs, and OpenBreweryDB.

- Utilizes Mapbox CDN/APIs.
- Brewery cards are rendered dynamically via jQuery.
- Upon clicking "Map It!" button, the address is passed into the Mapbox geocoding API.
- Firebase is used to add more breweries to the user search. When form is filled out and submitted, the brewery will appear in new user searches in that area.