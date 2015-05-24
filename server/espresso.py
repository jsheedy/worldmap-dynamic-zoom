import json
import logging
import os
import random

from flask import Flask, Response, request
from flask_cors import CORS
from flask.ext.cache import Cache

import db

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
cors = CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/country/')
def country_list():
    bbox = map(float, request.values.getlist('bbox'))
    data = db.country_list(bbox=bbox)
    response = list(data)
    return Response(json.dumps(response), mimetype='application/json')

def make_cache_key(*args, **kwargs):
    return request.url

@app.route('/country/<id>')
@cache.cached(key_prefix=make_cache_key)
def country(id):
    zoom = int(request.values.get('zoom', 1))

    geojson, name = db.country(id, zoom=zoom)

    feature = {
        "type": "Feature",
        "properties": {
            "name": name,
        },
        "geometry": json.loads(geojson)
    };
    return Response(json.dumps(feature), mimetype='application/json')


if __name__ == '__main__':
    app.debug = True
    app.run()
