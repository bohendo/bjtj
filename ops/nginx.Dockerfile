FROM alpine:3.6

MAINTAINER twitter.com/bohendo

RUN apk add --update nginx openssl

# initialize a stronger dhparam (separate RUN so it gets cached)
RUN openssl dhparam -out /etc/ssl/dhparam.pem 4096

RUN mkdir -p /etc/certs && \
  # initialize a self-signed placeholder cert
  openssl req \
    -newkey rsa:2048 -nodes -keyout /etc/certs/privkey.pem \
    -x509 -days 365 -out /etc/certs/fullchain.pem \
    -subj "/C=CA/ST=Ontario/L=Toronto/O=Org/OU=IT/CN=example.com" && \
  # Link the logs to something docker can collect automatically
  ln -fs /var/log/nginx/error.log /dev/stderr && \
  ln -fs /var/log/nginx/access.log /dev/stdout


COPY ./ops/nginx.conf /etc/nginx/nginx.conf

COPY ./built/static /var/www/static

COPY ./ops/nginx.entry.sh /root/nginx.entry.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["sh", "/root/nginx.entry.sh"]
