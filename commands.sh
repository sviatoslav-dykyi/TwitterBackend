npm install express
npm i typescript ts-node nodemon @types/node @types/express --save-dev

npm i prisma --save-dev

npx prisma init --datasource-provider sqlite

npx prisma migrate dev --name "init"
npx prisma studio

npm i @prisma/client

curl -X POST -H "Content-Type: application/json" \
-d "{\"name\": \"Elon Musk\", \"email\": \"gog1@gmail.com\", \"username\": \"Main Gog1\"}" \
http://localhost:3000/user/

npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken

npm i @aws-sdk/client-ses
# SES - Siplme email sending
# IAM - Identity and Access Management - получити ключі для доступуп до консолі із програми
# RDS - Relational Database service
# EC2 - Virtual services in cloud ()

npm i dotenv --save

npx tsc --init # init tsconfig.json

chmod 400 Documents/7/TwitterAPIKey/TwitterAPIKey.pem

# we are connecting to linux machine that is running in cloud through ssh
ssh -i Documents/7/TwitterAPIKey/TwitterAPIKey.pem ec2-user@ec2-13-51-85-156.eu-north-1.compute.amazonaws.com

# in terminal we have blank linux system
pwd

# Next step - install and configure node.js on our ec2 instance from which we are connected using ssh

# install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc # to not to restart terminal
nvm install --lts # install Long term support version of Node

sudo yum update -y # use yum for package manager to install git
sudo yum install git -y # install git

git clone https://github.com/sviatoslav-dykyi/TwitterBackend.git # cloning repo
cd TwitterBackend
npm i
npm run start
npm install pm2 -g

pm2 start TwitterBackend/build/index.js
pm2 status
pm2 monit


http://ec2-13-51-85-156.eu-north-1.compute.amazonaws.com:3000/
