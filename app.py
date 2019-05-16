from flask import Flask, render_template, request
import os
import sys

app = Flask(__name__)

PORT = int(os.getenv('PORT', 8080))
HOST = os.getenv('HOST', 'localhost')

@app.route("/")
def main():
    return "hello"
    
@app.route('/button_pressed')
def button_pressed():
    type = request.args.get('type')
    print('You clicked ' + type, file=sys.stderr)
    # Save image when I work out how to submit it from front end
    #file = request.files['image']
    #f = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)

    # add your custom code to check that the uploaded file is a valid image and not a malicious file (out-of-scope for this post)
    #file.save(f)
    return("nothing")


if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=False)