#!/usr/bin/env sh

echo "Deploy app - tag $TAG"

SSH_KEY_FILE=./server_ssh_key.pem
PROJECT_ENV_FILE=./.env

#Enable debugging mode
set -x
# Remove old ssh key file
rm -f $SSH_KEY_FILE
# Cat ssh key from Jenkins Credentials to ssh key file
cat $SERVER_SSH_KEY_FILE > $SSH_KEY_FILE
chmod 400 $SSH_KEY_FILE

# Cat env content from Jenkins Credentials to .env file
cat $ENV_FILE > $PROJECT_ENV_FILE

#Upload
scp -i $SSH_KEY_FILE dist.zip $SERVER_USERNAME@$SERVER_URL://home/ubuntu/your-project-api/dist.zip
scp -i $SSH_KEY_FILE prisma.zip $SERVER_USERNAME@$SERVER_URL://home/ubuntu/your-project-api/prisma.zip
scp -i $SSH_KEY_FILE package.json $SERVER_USERNAME@$SERVER_URL://home/ubuntu/your-project-api/package.json
scp -i $SSH_KEY_FILE yarn.lock $SERVER_USERNAME@$SERVER_URL://home/ubuntu/your-project-api/yarn.lock
scp -i $SSH_KEY_FILE $PROJECT_ENV_FILE $SERVER_USERNAME@$SERVER_URL://home/ubuntu/your-project-api/.env

#Deploy
#Deploy
ssh -i $SSH_KEY_FILE $SERVER_USERNAME@$SERVER_URL '
  cd your-project-api
  export PATH="$PATH:/home/ubuntu/.nvm/versions/node/v18.16.0/bin"
  pm2 stop your-project-api
  yarn install
  rm -R dist
  unzip dist.zip
  rm -R prisma
  unzip prisma.zip
  yarn prisma generate
  yarn prisma migrate deploy
  pm2 restart your-project-api --update-env
'

OUT=$?
#Disable debugging mode
set +x

if [ $OUT -eq 0 ]
then
  echo 'Deploy: Successful'
  exit 0
else
  echo 'Deploy: Failed'
  exit 1
fi
