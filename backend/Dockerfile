FROM node:14-alpine

WORKDIR /backend

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "index.js" ]
# RUN npm run start --quiet
