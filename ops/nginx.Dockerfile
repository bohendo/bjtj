FROM alpine:3.6

MAINTAINER twitter.com/bohendo

RUN apk add --update nginx openssl

# initialize a stronger dhparam (separate RUN so it gets cached)
RUN openssl dhparam -out /etc/ssl/dhparam.pem 2048

RUN mkdir -p /etc/certs && \
  # Link the logs to something docker can collect automatically
  ln -fs /dev/stderr /var/log/nginx/error.log && \
  ln -fs /dev/stdout /var/log/nginx/access.log

COPY ./ops/nginx.entry.sh /root/nginx.entry.sh
COPY ./ops/nginx.conf /etc/nginx/nginx.conf
COPY ./built/static /var/www/static

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["sh", "/root/nginx.entry.sh"]
