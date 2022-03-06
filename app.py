from flask import Flask, render_template, request
import os
import json
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bgaek')
def bgaek():
    return render_template('bgaek.html')

@app.route('/builder', methods=['GET', 'POST'])
def builder():
    if request.method == 'POST':
        data = json.loads(request.form.get('data'))
        print(type(data))
        with open('static/json/data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f)
    files = os.listdir("./static/image")
    return render_template('builder.html', files=enumerate(files))

@app.route('/test')
def test():
    return render_template('test.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
