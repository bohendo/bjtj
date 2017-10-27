
FROM alpine:3.6

MAINTAINER Bo Henderson <twitter.com/bohendo>

RUN apk add --update nodejs

COPY ./built/server.bundle.js /root/server.bundle.js

ENTRYPOINT ["node", "/root/server.bundle.js"]

