# defaults

DB="world"
USER="velotron"
PASSWORD=""

MINCONN = 8
MAXCONN = 16

try:
	from local_config import *
except ImportError:
	print("override settings by creating local_config.py")
