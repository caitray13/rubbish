### TRASH

TRASH is an image classifier which aims to help users recycle correctly.

TRAINING
Using Transfer Learning take a pre-trained model, namely Mobilenet which is a mobile-first computer vision model for Tensorflow, developed at Google.
Retrain the model on images of trash (including paper, plastic, glass, metal). 
Add a classification head made up of 4 layers using a softmax activation function. This gives you a probability between 0 and 1 that an image falls into a certain category.
Freeze the bottom layers of the Mobilenet and then retrain the model with the classification layers on images of rubbish and their corresponding labels.
(Training done on AWS) 
Convert this model to TFlite format, which is optimized for mobile devices. This model is then deployed onto the Raspberry Pi.

CLASSIFICATION
TRASH allows a user to hold up an item of rubbish to a web camera connected to the Raspberry Pi. The Pi is connected to a Pibrella board The LEDs of the Pibrella board indicate which category the rubbish falls into; paper, plastic or trash.

