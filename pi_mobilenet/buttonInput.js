const Gpio = require("pigpio").Gpio;

const button = new Gpio(11, {
	mode: Gpio.INPUT,
	pullUpDown: Gpio.PUD_DOWN,
	edge: Gpio.FALLING_EDGE
});

button.on("interrupt", (level) => {
	console.log("pressed");
});