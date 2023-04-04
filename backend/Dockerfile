# stage 1
FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm ci --omit=dev \
    && npm run build

# stage 2
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

ARG PORT

ENV port=$PORT

EXPOSE $port

CMD ["npm", "run", "start:prod"]