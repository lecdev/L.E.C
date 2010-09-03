var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events");

function load_static_file(uri, response) {
	var filename = path.join(process.cwd(), uri);
	path.exists(filename, function(exists) {
		if(!exists) {
			response.sendHeader(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.close();
			return;
		}

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.sendHeader(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.close();
				return;
			}

			response.sendHeader(200);
			response.write(file, "binary");
			response.close();
		});
	});
}

var update_emitter = new events.EventEmitter();
var storage = [];

function get_updates() {
  
  // pull from couchDB or whatever document storage
  
  var i = storage.length;
  sys.puts(i);
  update_emitter.emit("updates",JSON.parse(storage[0]))

/*  
	var request = twitter_client.request("GET", "/1/statuses/public_timeline.json", {"host": "api.twitter.com"});

	request.addListener("response", function(response) {
		var body = "";
		response.addListener("data", function(data) {
			body += data;
		});

		response.addListener("end", function() {
			var updates = JSON.parse(body);
			if(updates.length > 0) {
				tweet_emitter.emit("updates", updates);
			}
		});
	});

	request.close();
	*/
}

setInterval(get_updates, 5000);

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    if(uri === "/stream") {

    	var listener = update_emitter.addListener("updates", function(updates) {
    		response.sendHeader(200, { "Content-Type" : "text/plain" });
    		response.write(JSON.stringify(updates));
    		response.close();

    		clearTimeout(timeout);
    	});

    	var timeout = setTimeout(function() {
    		response.sendHeader(200, { "Content-Type" : "text/plain" });
    		response.write(JSON.stringify([]));
    		response.close();

    		update_emitter.removeListener(listener);
    	}, 10000);

    } else if (uri === "/push"){
      // write to couchdb or whatever document storage here
      storage.push("{'message':'pushed!'}");
      sys.puts("done a push");
    } else {
    	load_static_file(uri, response);
    }
}).listen(8080);

sys.puts("Server running at http://localhost:8080/");
