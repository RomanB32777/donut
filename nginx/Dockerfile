FROM nginx:1.20.1-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d

# COPY ./config/default.template /etc/nginx/conf.d/default.template

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]