FROM alpine:3.6

MAINTAINER twitter.com/bohendo

RUN apk add --update nginx openssl

# initialize a stronger dhparam (separate RUN so it gets cached)
RUN openssl dhparam -out /etc/ssl/dhparam.pem 2048

RUN mkdir -p /etc/certs && \
  # initialize a placeholder cert
  openssl req \
    -newkey rsa:2048 -nodes -keyout /etc/certs/backup.key \
    -x509 -days 365 -out /etc/certs/backup.crt \
    -subj "/C=CA/ST=Ontario/L=Toronto/O=Org/OU=IT/CN=example.com" && \
  # Link the logs to something docker can collect automatically
  ln -fs /dev/stderr /var/log/nginx/error.log && \
  ln -fs /dev/stdout /var/log/nginx/access.log

COPY ./ops/nginx.conf /etc/nginx/nginx.conf
COPY ./built/static /var/www/static
COPY ./ops/nginx.entry.sh /root/nginx.entry.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["sh", "/root/nginx.entry.sh"]
