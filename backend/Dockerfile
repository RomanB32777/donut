# stage 1
FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN npm run types:install

RUN npm run types:build

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm ci 
# --omit=dev
# && npm run build
# && npm prune --production
# RUN npm install -g @nestjs/cli

RUN npm run build

# RUN rm -rf ./types

# stage 2
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

ARG PORT

ENV port=$PORT

EXPOSE $port

# CMD [ "node", "dist/main.js" ]
CMD ["npm", "run", "start:prod"]
# CMD ["ls", "node_modules/types"]