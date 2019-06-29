var NodeWebcam = require("node-webcam");

var tempId;

var opts = {
	width: 600,
	height: 400,
	quality: 100,
	delay: 0,
	saveShots: true,
	output: "jpeg",
	device: false,
	callbackReturn: "location",
	verbose: false
};

var Webcam = NodeWebcam.create(opts);

Webcam.list( function(list) {
	console.log(list);
});


Webcam.capture( "test_picture", function(err, data) {
	console.log(err);
	console.log(data);
} );
