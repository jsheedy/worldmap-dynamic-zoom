World map 
=========

This is an angular.js / leaflet / flask / postgis world map which serves GeoJSON features that are simplified on the server size based on map zoom level.

To serve the angular app:

```
npm install

bower install

grunt serve
```

To serve the Flask app:

```
cd server/
python3 espresso.py
# or gunicorn -w 4 -k gaiohttp  -b 127.0.0.1:5000 espresso:app
```
