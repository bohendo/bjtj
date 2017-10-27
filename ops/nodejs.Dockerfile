
FROM alpine:3.6

RUN apk --update add nodejs

COPY built/server.bundle.js /root

ENTRYPOINT ["node", "/root/server.bundle.js"]

