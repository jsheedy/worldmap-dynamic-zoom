import config


class Query():

    def country_list(self, bbox): pass

    def country(self, id): pass


class World(Query):

    def country_list(self, bbox=None):
        query = """SELECT MAX(fips_cntry) from world_borders """
        if bbox:
            envelope = ','.join(map(str, bbox))
            query += """ WHERE world_borders.geom && ST_MakeEnvelope(""" + envelope + ")"

        query += " GROUP BY fips_cntry"
        return query

    def country(self):
        query = """
        SELECT ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_Union(geom),%s)), MAX(cntry_name)
        FROM world_borders
        WHERE fips_cntry=%s
        GROUP BY fips_cntry"""
        return query


class GADM2(Query):

    def country_list(self, bbox):pass
    def country(self):pass

if config.DB == 'world':
    db = World()
elif config.DB == 'gadm2':
    db = GADM2()