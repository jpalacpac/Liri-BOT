// Storing dependencies as variables.
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js');
var fs = require('fs');

// Users first Action.
var firstInput = process.argv[2];
// Action for second parameter: spotify or movie. 
var secondInput = process.argv.slice(3).join();

// Commands to call a function.
switch(firstInput) {

	case "my-tweets":
	twitterApi();
	break;

	case "spotify-this-song":
	spotifyApi();
	break;

	case "movie-this":
	omdbApi();
	break;

	case "do-what-it-says":
	randomTxt();
	break;

	default:
	// Give user command options.
	console.log("Hello, my name is LIRI. Please type one of these commands: my-tweets , spotify-this-song <type a song name> , movie-this <type a movie name> , do-what-it-says")
	break;
};

function twitterApi() { 

	var client = new Twitter(keys.twitterKeys);

	var params = {screen_name: 'TheRock'};
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  
	    if (!error) {
		    for (var i = 0; i < tweets.length; i++) {
		    	console.log("@" + tweets[i].user.name);
		    	console.log("Tweet: " + tweets[i].text);
		    	console.log("Created at: " + tweets[i].created_at);
		    	console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
		    	
		    	fs.appendFile('log.txt', "\n@" + tweets[i].user.name + "\nTweet: " + tweets[i].text + 
		    	"\nCreated at: " + tweets[i].created_at + "\n---------------------twitter----------------------")
		    } 
  		} 
	}); 
}; 

function spotifyApi() {

	var spotify = new Spotify(keys.spotifyKeys);
 
	if (!secondInput) {
		secondInput = "The Sign of Base";
	}; 

	spotify.search({ type: 'track', query: secondInput }, function(err, data) {
  		if (!err) {	
 			
 			for (var i = 0; i < data.tracks.items.length; i++) {
 				var songData = data.tracks.items[i];
				
				console.log("Artist: " + songData.artists[0].name);
				console.log("Song: " + songData.name);
				console.log("Preview Song: " + songData.preview_url);
				console.log("Album: " + songData.album.name);
				console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
			
				fs.appendFile('log.txt', "\nArtist: " + songData.artists[0].name + "\nSong: " + songData.name + "\nPreview Song: " + 
				songData.preview_url + "\nAlbum: " + songData.album.name + "\n---------------------spotify----------------------")
			}
 		} 

 		else {
 			return console.log('Error occurred: ' + err);
 		}
	});
};

function omdbApi() {

	if (!secondInput) {
		secondInput = "Mr.Nobody";
		console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      	console.log("It's on Netflix!");
      	console.log("---------------------------------------")
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + secondInput + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
		
			var body = JSON.parse(body);

			console.log("Title: " + body.Title);
			console.log("Year: " + body.Year);
			console.log("IMBD Rating: " + body.imdbRating);
			console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
			console.log("Country: " + body.Country);
			console.log("Language: " + body.Language);
			console.log("Plot: " + body.Plot);
			console.log("Actors: " + body.Actors);

			fs.appendFile('log.txt', "\nTitle: " + body.Title + "\nYear: " + body.Year + "\nIMDB Rating: " + body.imdbRating + 
			"\nRotten Tomatoes Rating: " + body.tomatoRating + "\nCountry: " + body.Country + "\nLanguage: " + body.Language + 
			"\nPlot: " + body.Plot + "\nActors: " + body.Actors + "\n---------------------MOVIE----------------------")
		} 

		else {
			console.log("Error occured: " + error)
		}
	});
};

function randomTxt() {

	fs.readFile('random.txt', "utf8", function(error, data){
    	if (error) {
    		console.log("Error occured: " + error)
    	}

    	data = data.split(",");
    	secondInput = data[1];
    	switch (data[0]) {
     		case "spotify-this-song":
        	spotifyApi();
        	break;
    	}
  	});
}; 