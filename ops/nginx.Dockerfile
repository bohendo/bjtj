FROM nginx:latest

MAINTAINER twitter.com/bohendo

COPY ./ops/dhparam.pem /etc/nginx/dhparam.pem

COPY ./ops/nginx.conf /etc/nginx/nginx.conf

COPY ./built/static /var/www/static

