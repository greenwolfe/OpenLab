#restore latest backup of local mongo database of a meteor project.
#with the project running on localhost, get the port from:
#meteor mongo --url
#as it may not be 3001

mongorestore -h 127.0.0.1 --port 3001 --db meteor dump/meteor/ --drop