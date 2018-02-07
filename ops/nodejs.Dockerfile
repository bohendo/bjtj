FROM node:8.8-alpine

MAINTAINER Bo Henderson <twitter.com/bohendo>

COPY ./build/server.bundle.js /root/server.bundle.js
COPY ./build/static /root/static

WORKDIR /root

ENTRYPOINT ["node", "/root/server.bundle.js"]
