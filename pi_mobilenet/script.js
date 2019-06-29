const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
global.fetch = require("node-fetch");
require('@tensorflow/tfjs-node');

var Jimp = require("jimp");

var NodeWebcam = require("node-webcam");

const fs = require('fs');

const jpeg = require('jpeg-js');

const Gpio = require("pigpio").Gpio;

const greenLED = new Gpio(4, {mode: Gpio.OUTPUT});
const yellowLED = new Gpio(17, {mode: Gpio.OUTPUT});
const redLED = new Gpio(27, {mode: Gpio.OUTPUT});

const NUMBER_OF_CHANNELS = 3

const readImage = path => {
  const buf = fs.readFileSync(path)
  const pixels = jpeg.decode(buf, true)
  return pixels
}

const imageByteArray = (image, numChannels) => {
  const pixels = image.data
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }

  return values
}

const imageToInput = (image, numChannels) => {
  const values = imageByteArray(image, numChannels)
  const outShape = [1, image.height, image.width, numChannels];
  //const outShape = [244, 244, 3];
  const input = tf.tensor4d(values, outShape, 'float32');

  return input
}

const loadModel = async path => {
  //const mn = new mobilenet.MobileNet(1, 1);
  //mn.path = `file://${path}`
  //await mn.load()
  //const mn = await mobilenet.load();
  	//const mn = await tf.loadLayersModel("file:///home/pi/mobilenet/tfjs_model/model.json");
	//const mn = await tf.loadGraphModel("file:///home/pi/mobilenet/tfjs_model/model.json");
	const mn = await tf.loadGraphModel("file:///home/pi/mobilenet/tfjs_model1/model.json");
	return mn;
}

const classify = async (model, path) => {
	console.log("classifying");
  //const image = readImage(path);
  const image = readImage("small_test_picture.jpg");
  const input = imageToInput(image, NUMBER_OF_CHANNELS);
  
  const  mn_model = await loadModel(model)
  //const predictions = await mn_model.classify(input)
  const predictions = await mn_model.predict(input)

  //console.log('classification results:', predictions)
  //predictions.print();
  const test = predictions.dataSync();
  const values = Array.from(test);
  console.log(values);
  	let i = values.indexOf(Math.max(...values));
/*
	const mainPrediction = predictions[0];
	const predictedClass = mainPrediction.className;
	if (predictedClass.includes("panda")) {
		greenLED.digitalWrite(1);
	} else {
		redLED.digitalWrite(1);
	}
	*/
	
	if (i === 0) {
		greenLED.digitalWrite(1);
	} else if (i === 1) {
		redLED.digitalWrite(1);
	} else {
		yellowLED.digitalWrite(1);
	}		
}

const clearLED = () => {
	greenLED.digitalWrite(0);
	yellowLED.digitalWrite(0);
	redLED.digitalWrite(0);
}

const resizePicture = () => {
	console.log("resizing picture");
	Jimp.read("test_picture.jpg", (err, pic) => {
	if (err) throw err;
	pic
	.resize(224, 224)
	.write("small_test_picture.jpg");
	});
	return new Promise(resolve => setTimeout(resolve, 1000));
}

const getPicture = async () => {
	await takePicture();
	await resizePicture();
	return new Promise(resolve => setTimeout(resolve, 1000));
}

const takePicture = () => {
	console.log("taking picture");
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
	
	Webcam.capture( "test_picture", function(err, data) {
		console.log(err);
		console.log(data);
	});
	return new Promise(resolve => setTimeout(resolve, 1000));
}

//if (process.argv.length !== 4) throw new Error('incorrect arguments: node script.js <MODEL> <IMAGE_FILE>')

clearLED();

const mainFunction = async () => {
	await getPicture();
	classify(process.argv[2], process.argv[3]);
}
/*
const button = new Gpio(11, {
	mode: Gpio.INPUT,
	pullUpDown: Gpio.PUD_DOWN,
	edge: Gpio.FALLING_EDGE
});

button.glitchFilter(50000);
*/

if (process.argv[2] !== "clear") {
	/*
	button.on("interrupt", (level) => {
		console.log("pressed");
		clearLED();
		mainFunction();
		return;
	});*/
	mainFunction();
}
/*
if (process.argv[2] !== "clear") {
	classify(process.argv[2], process.argv[3])
}
*/