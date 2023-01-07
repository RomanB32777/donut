FROM node:14-alpine

WORKDIR /sockets

COPY . .

RUN npm install

EXPOSE 4005

CMD [ "npm", "run", "start" ]
# RUN npm run start --quiet
