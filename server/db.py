import contextlib
import logging
import time

import psycopg2
import psycopg2.extras as extras
import psycopg2.pool as pool

DB="world"
USER="velotron"
PASSWORD=""

MINCONN = 8
MAXCONN = 16

connection_pool = pool.ThreadedConnectionPool(MINCONN, MAXCONN, database=DB, user=USER, password=PASSWORD)

@contextlib.contextmanager
def get_cursor():
    try:
        for i in range(5): # try a few times
            try:
                conn = connection_pool.getconn()
                cursor = conn.cursor(cursor_factory=extras.DictCursor)
                logging.debug('got connection.  rused: {}'.format(connection_pool._rused))
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
        query = """SELECT MAX(fips_cntry), MAX(cntry_name) from world_borders """
        if bbox:
            envelope = ','.join(map(str, bbox))
            query += """ WHERE world_borders.geom && ST_MakeEnvelope(""" + envelope + ")"

        query += " GROUP BY fips_cntry"
        cursor.execute(query)
        yield from cursor

def country(id=None):
    with get_cursor() as cursor:
        query = """
        SELECT ST_AsGeoJSON(ST_Simplify(ST_Union(geom),.05))
        FROM world_borders
        WHERE fips_cntry=%s
        GROUP BY fips_cntry"""
        cursor.execute(query, [id])
        return cursor.fetchone()[0]
