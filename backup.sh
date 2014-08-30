#backup local mongo database of a meteor project.
#with the project running on localhost, get the port from:
#meteor mongo --url
#as it may not be 3001

filename="dump/meteor"
rm -R $filename
mongodump -h 127.0.0.1 --port 3001 -d meteor
cp -R $filename $filename$(date +"%Y-%m-%dT%H:%M:%S")