import config


class Query():

    def country_list(self, bbox): pass

    def country(self, id): pass


class World(Query):

    def country_list(self, bbox=None):
        query = """SELECT MAX(fips) from world_borders """
        if bbox:
            envelope = ','.join(map(str, bbox))
            query += """ WHERE world_borders.geom && ST_MakeEnvelope(""" + envelope + ", 4326)"

        query += " GROUP BY fips"
        return query

    def country(self):
        query = """
        SELECT ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_Union(geom),%s)), MAX(name)
        FROM world_borders
        WHERE fips=%s
        GROUP BY fips"""
        return query


class GADM2(Query):

    def country_list(self, bbox):pass
    def country(self):pass


class InvalidConfigurationError(Exception): pass

if config.DB['NAME'] == 'world':
    db = World()
elif config.DB['NAME'] == 'gadm2':
    db = GADM2()
else:
    raise InvalidConfigurationError("config.db must define a NAME key containing one of (world, gadm2) in order to define queries")
