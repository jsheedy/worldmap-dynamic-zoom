# World map 

This is an angular.js / leaflet / flask / postgis world map which serves GeoJSON features that are simplified on the server size based on map zoom level.

## Serve the angular app:

```
npm install

bower install

grunt serve
```

## Set up the database:

Download the [mappinghacks world_borders.zip](http://www.mappinghacks.com/data/).

Convert to postgis:

```
shp2pgsql -W LATIN1  world_borders  > world_borders.sql
```

## Import to postgis:

```
createdb world
psql -c 'create extension postgis' world
psql -f world_borders.sql world
```

TODO: move to higher resolution data, maybe [Natural Earth Data](http://www.naturalearthdata.com/downloads/10m-cultural-vectors/) or [GSHHG](http://www.soest.hawaii.edu/pwessel/gshhg/)

## Serve the Flask app:

```
cd server/
python3 espresso.py
# or gunicorn -w 4 -k gaiohttp  -b 127.0.0.1:5000 espresso:app
```
