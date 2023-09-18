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

npm i dotenv --save

npx tsc --init # init tsconfig.json

