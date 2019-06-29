var Jimp = require("jimp");

Jimp.read("test_picture.jpg", (err, pic) => {
	if (err) throw err;
	pic
	.resize(224, 224)
	.write("small_test_picture.jpg");
});