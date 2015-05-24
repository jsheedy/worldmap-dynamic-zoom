import contextlib
import logging
import time

import psycopg2
import psycopg2.extras as extras
import psycopg2.pool as pool

import config

connection_pool = pool.ThreadedConnectionPool(config.MINCONN, config.MAXCONN, database=config.DB, user=config.USER, password=config.PASSWORD)

@contextlib.contextmanager
def get_cursor():
    try:
        for i in range(5): # try a few times
            try:
                conn = connection_pool.getconn()
                logging.debug('got connection.  rused: {}'.format(connection_pool._rused))
                # cursor = conn.cursor(cursor_factory=extras.DictCursor)
                cursor = conn.cursor()
                yield cursor
                break
            except pool.PoolError:
                logging.debug('Missed pool connection on try {}'.format(i))
                time.sleep(i/5.0)
        else:
            raise pool.PoolError('connection pool full')

    except Exception as e:
        if conn:
            logging.exception("Closing with rollback")
            conn.rollback()
        raise
    else:
        conn.commit()
    finally:
        if conn:
            connection_pool.putconn(conn)

def country_list(bbox=None):
    with get_cursor() as cursor:
        query = """SELECT MAX(fips_cntry) from world_borders """
        if bbox:
            envelope = ','.join(map(str, bbox))
            query += """ WHERE world_borders.geom && ST_MakeEnvelope(""" + envelope + ")"

        query += " GROUP BY fips_cntry"
        cursor.execute(query)
        yield from cursor

zoom_levels = [1/x**2 for x in range(1, 20)]
def country(id=None, zoom=1):

    tolerance = zoom_levels[zoom]

    with get_cursor() as cursor:
        query = """
        SELECT ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_Union(geom),%s)), MAX(cntry_name)
        FROM world_borders
        WHERE fips_cntry=%s
        GROUP BY fips_cntry"""
        cursor.execute(query, [tolerance, id])
        return cursor.fetchone()
