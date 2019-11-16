var userText = "";
var giphys = ["Drake", "Travis Scott", "Tupac", "Jay-Z", "Snoop Dogg"];
var giphysFull = false;
var giphyImage = "";
var imageRating = "";
var ratingText = "";


// creates buttons using array of giphy topics
function createButtons() {
    $(".giphyButtons").empty(); // empty previous gifs
    for (var i = 0; i < giphys.length; i++) {
        $("<button class='giphys'>" + giphys[i] + "</button>").appendTo(".giphyButtons");
	}
}

// add user topics to array
function addUserText() {
    giphys.push(userText);
}

// clear user input from text box & variable
function clearUserText() {
	userText = "";
	$(".searchBox").val("");
}


// create initial buttons when page loads
$(document).ready(function () {

	// display pre-defined topic buttons
	createButtons();

	// when add button is clicked get the user's input and create a new button
	$(".addButton").click(function (e) {
		userText = $(".searchBox").val();
		if (userText !== "") {
			addUserText();
			createButtons();
			clearUserText();
		} else {
			alert("Please enter a valid search topic.");
		}
	});

	// build image collection when 
	$(".buttonSection").on("click", ".giphys", function (event) {

		// user's entry set to this object
		var giphyChoiceText = $(this).text();

		// giphy api query
		var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + giphyChoiceText + "&api_key=dc6zaTOxFJmzC&limit=10";

		// testing
		// console.log(queryUrl);

		// calling GET method on giphy API
		$.ajax({
			url: queryUrl,
			method: 'GET'
			}).done(function (response) {

			// add 10 images from response array
			function giphyGenerate() {

				// loop through response data
				for (var i = 0; i < response.data.length; i++) {

					// create a div to contain the image 
					giphyImage = $("<img class='stillPictures'>");

					// attach these attributes to each image, set initial image to still
					giphyImage.attr('src', response.data[i].images.fixed_height_still.url);
					giphyImage.attr('data-still', response.data[i].images.fixed_height_still.url);
					giphyImage.attr('data-animate', response.data[i].images.fixed_height.url);
					giphyImage.attr('data-state', "still");

					// retrieve image rating from api response
					imageRating = response.data[i].rating;

					// div created to hold rating text
					ratingText = $("<div class='rating'>");

					// then add rating text 
					ratingText.text("Rating: " + imageRating);

					// display rating text with image
					$(".giphyImages").append(ratingText);

					// appends the image to div
					$(".giphyImages").append(giphyImage);

					// mark full
					giphysFull = true;
					} // end rating and image for loop
				} // end giphygenerate

				// if there are no current images 
				if (giphysFull == false) {

					// get new images
					giphyGenerate();

				} else {
					// otherwise clear previous images
					$(".giphyImages").empty();

					// clear flag after empyting images
					giphysFull = false;

					// get new images
					giphyGenerate();
				}
			}); // end handling api response 
		}); // end image click event

	// change the state of images when clicked
	$(document).on("click", ".stillPictures", function (event) {
		var that = $(this);

		// create variables to hold the click selections attributes
		var currentData = that.attr("data-state");
		var animateCurrent = that.attr("data-animate");
		var stillCurrent = that.attr("data-still");

		// if the data state is still, animate it, if the data state is animate, still it
		if (currentData == "still") {
			that.attr('data-state', "animate");
			that.attr('src', animateCurrent);
		} else if (currentData == "animate") {
			that.attr('data-state', "still");
			that.attr('src', stillCurrent);
		}
	}); // end image click event

}); // end document ready
