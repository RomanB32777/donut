FROM node:14-alpine

WORKDIR /sockets

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 4005

CMD [ "node", "index.js" ]
# RUN npm run start --quiet
