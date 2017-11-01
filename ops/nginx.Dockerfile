FROM alpine:3.6

MAINTAINER Bo Henderson <twitter.com/bohendo>

# initialize a stronger dhparam (separate RUN so dhparam gets cached)
RUN apk add --update openssl certbot nginx && \
    openssl dhparam -out /etc/ssl/dhparam.pem 2048

RUN mkdir -p /etc/certs && \
  # Link the logs to stdout so docker can collect them
  ln -fs /dev/stderr /var/log/nginx/error.log && \
  ln -fs /dev/stdout /var/log/nginx/access.log

COPY ./ops/nginx.entry.sh /root/entry.sh
COPY ./ops/nginx.conf /etc/nginx/nginx.conf
COPY ./built/static /var/www/static

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["sh", "/root/entry.sh"]
