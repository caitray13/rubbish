const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
let net;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
      
    canvasElement.style.display = 'block';
    const context = canvasElement.getContext('2d');
    context.drawImage(webcamElement, 0, 0, 320, 240);
    let picture = canvasElement.toDataURL();
    
    picture_data = JSON.stringify({data: picture })
    url = 'http://localhost:8080/picture?pic=' + picture_data
    console.log(url)
    const Http1 = new XMLHttpRequest();
    Http1.open("POST", url, true);
    Http1.send();
    
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
    // Submit the picture and label to Flask server
    var binDict = {
        0: "recycling",
        1: "food",
        2: "garbage"
    };
    url = 'http://localhost:8080/button_pressed?type=' + binDict[classId] # &image=<something>
    console.log(url)
    console.log(binDict[classId])
    const Http = new XMLHttpRequest();
    Http.open("GET", url, true);
    Http.send();    
  };

  // When clicking a button, add an example for that class.
  document.getElementById('recycling').addEventListener('click', () => addExample(0));
  document.getElementById('food').addEventListener('click', () => addExample(1));
  document.getElementById('garbage').addEventListener('click', () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['A', 'B', 'C'];
      document.getElementById('console').innerText = `
        prediction: ${classes[result.classIndex]}\n
        probability: ${result.confidences[result.classIndex]}
      `;
    }

    await tf.nextFrame();
  }
}


async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}
app();