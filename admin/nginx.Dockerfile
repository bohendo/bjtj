FROM nginx:latest

MAINTAINER twitter.com/bohendo

RUN mkdir -p /var/www/static && rm -rf /var/www/static/*

COPY ./admin/nginx.conf /etc/nginx/nginx.conf

COPY ./built/static /var/www/static

