# stage 1
FROM node:16-alpine AS builder

WORKDIR /app

COPY /types ../types

COPY . .

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g @nestjs/cli \
    && npm ci \
    && npm run build

# stage 2
# FROM node:16-alpine

# WORKDIR /app

# COPY --from=builder /app ./

ARG PORT

ENV port=$PORT

EXPOSE $port

RUN echo $(ls -1 ./node_modules/types/)

CMD ["npm", "run", "start:prod"]