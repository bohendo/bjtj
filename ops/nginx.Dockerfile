FROM nginx:latest

MAINTAINER twitter.com/bohendo

RUN mkdir -p /var/www && rm -rf /var/www/static

COPY ./ops/nginx.conf /etc/nginx/nginx.conf

COPY ./built/static /var/www/static

