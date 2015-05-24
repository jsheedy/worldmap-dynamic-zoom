import json
import logging
import os
import random

from flask import Flask, Response, request
from flask_cors import CORS

import db

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
cors = CORS(app)


@app.route('/country/')
def country_list():
    bbox = map(float, request.values.getlist('bbox'))
    response = list(db.country_list(bbox=bbox))
    return Response(json.dumps(response), mimetype='application/json')

@app.route('/country/<id>')
def country(id):
    response = db.country(id)
    return Response(response, mimetype='application/json')


if __name__ == '__main__':
    app.debug = True
    app.run()
