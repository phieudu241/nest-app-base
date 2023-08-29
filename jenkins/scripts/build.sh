echo "Building app, tag $TAG"

# Exit on error
set -e

# Enable debug
set -x

# Cat env content from Jenkins Credentials to .env file
cat $ENV_FILE > ./.env

#Build
export PATH="$PATH:/usr/local/nvm/versions/node/v18.16.0/bin"
rm -rf dist
yarn install
yarn prisma generate
yarn build
rm -f dist.zip
zip -r dist.zip dist

rm -f prisma.zip
zip -r prisma.zip prisma

OUT=$?
set +x

if [ $OUT -eq 0 ]
then
  exit 0
else
  echo 'Failure: app build'
  exit 1
fi
