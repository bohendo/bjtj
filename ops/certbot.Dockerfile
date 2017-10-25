
FROM alpine

RUN apk add --no-cache certbot

COPY ./ops/certbot.entry.sh /root/

ENTRYPOINT ["sh", "/root/certbot.entry.sh"]

