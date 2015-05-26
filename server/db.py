import contextlib
import logging
import time

import psycopg2
import psycopg2.extras as extras
import psycopg2.pool as pool

import config
import queries

connection_pool = pool.ThreadedConnectionPool(config.MINCONN, config.MAXCONN, database=config.DB['DB'], user=config.DB['USER'], password=config.DB['PASSWORD'])

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
            connection_pool.putconn(conn, close=True)

        raise
    else:
        conn.commit()
        if conn:
            connection_pool.putconn(conn)

def country_list(bbox=None):
    with get_cursor() as cursor:
        query = queries.db.country_list(bbox)
        cursor.execute(query)
        yield from cursor

zoom_levels = [(10.0/x**4) for x in range(1, 20)]
def country(id=None, zoom=1):

    tolerance = zoom_levels[zoom]

    with get_cursor() as cursor:
        query = queries.db.country()
        cursor.execute(query, [tolerance, id])
        return cursor.fetchone()
