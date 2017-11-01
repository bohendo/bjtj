FROM alpine:3.6

RUN apk add --no-cache certbot

COPY ./ops/certbot.entry.sh /root/entry.sh

ENTRYPOINT ["sh", "/root/entry.sh"]
