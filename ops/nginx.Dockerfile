FROM nginx:1.13

MAINTAINER twitter.com/bohendo

COPY ./ops/dhparam.pem /etc/ssl/dhparam.pem

COPY ./ops/nginx.conf /etc/nginx/nginx.conf

COPY ./built/static /var/www/static

