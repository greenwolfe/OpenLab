#install latest backup of database from openlab.gwolfe.meteor.com
#to local version

dir ../openlabMongoDumps/dump/openlab_gwolfe_meteor_com
mongorestore -h 127.0.0.1 --port 3001 --db meteor ../openlabMongoDumps/dump/openlab_gwolfe_meteor_com/  --drop