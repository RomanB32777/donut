# stage 1
FROM node:16-alpine AS builder

COPY /types /types

WORKDIR /sockets

COPY . .

RUN rm -rf ./types

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# RUN npm ci --only=production
RUN npm ci \
    && npm run build \
    && npm prune --production


# stage 2
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /sockets /app/

ARG PORT

ENV port=$PORT

EXPOSE $port

CMD ["npm", "run", "start:prod"]