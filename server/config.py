# defaults

DB= {
    'NAME': 'world_borders',
    'DB': 'world',
    'USER': 'velotron',
    'PASSWORD': '',
}

MINCONN = 5
MAXCONN = 20

try:
	from local_config import *
except ImportError:
	print("override settings by creating local_config.py")
