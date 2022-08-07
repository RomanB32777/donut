FROM node:14-alpine AS builder

WORKDIR /client

COPY ./package.json ./

RUN npm install

COPY . .

ARG BACKEND_PORT

ENV REACT_APP_BACKEND_PORT=$BACKEND_PORT

RUN npm run build


FROM nginx:1.20.1-alpine

RUN apk --no-cache add curl

RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
    chmod +x envsubst && \
    mv envsubst /usr/local/bin

COPY /ssl/cryptodonutz.xyz /etc/ssl/cryptodonutz.xyz
COPY ./nginx.config /etc/nginx/nginx.template

CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

COPY --from=builder /client/build /usr/share/nginx/html
