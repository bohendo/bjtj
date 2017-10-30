
FROM alpine:3.6

MAINTAINER Bo Henderson <twitter.com/bohendo>

RUN apk add --update nodejs nodejs-npm &&\
    npm install -g nodemon

COPY ./built/server.bundle.js /root/server.bundle.js
COPY ./ops/nodejs.entry.sh /root/entry.sh

ENTRYPOINT ["sh", "/root/entry.sh"]

