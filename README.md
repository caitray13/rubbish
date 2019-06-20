The following is taken from the Google Codelab https://codelabs.developers.google.com/codelabs/tensorflow-for-poets

The steps in the tutorial apply to flower photos. However we will apply the retraining on our own rubbish dataset.
I found this dataset https://github.com/garythung/trashnet/blob/master/data/dataset-resized.zip but it's for different types of recycling.
We can use this as demo for the hackathon and explain we need a different dataset.

STEPS

git clone https://github.com/googlecodelabs/tensorflow-for-poets-2

cd tensorflow-for-poets-2

# Get the flower photos if following demo
# Luckily our rubbish dataset is set out the same way so easy swap
curl http://download.tensorflow.org/example_images/flower_photos.tgz | tar xz -C tf_files

# Set the following variables in shell
IMAGE_SIZE=224
ARCHITECTURE="mobilenet_0.50_${IMAGE_SIZE}"

python -m scripts.retrain \
  --bottleneck_dir=tf_files/bottlenecks \
  --how_many_training_steps=500 \
  --model_dir=tf_files/models/ \
  --summaries_dir=tf_files/training_summaries/"${ARCHITECTURE}" \
  --output_graph=tf_files/retrained_graph.pb \
  --output_labels=tf_files/retrained_labels.txt \
  --architecture="${ARCHITECTURE}" \
  --image_dir=tf_files/flower_photos
  
# Test retraining has worked
python -m scripts.label_image \
    --graph=tf_files/retrained_graph.pb  \
    --image=tf_files/flower_photos/daisy/21652746_cc379e0eea_m.jpg
    
# Should get results like
daisy (score = 0.99071)
sunflowers (score = 0.00595)
dandelion (score = 0.00252)
roses (score = 0.00049)
tulips (score = 0.00032)