FROM node:8.8-alpine

MAINTAINER Bo Henderson <twitter.com/bohendo>

RUN npm install -g nodemon

COPY ./ops/nodejs.entry.sh /root/entry.sh
COPY ./build/server.bundle.js /root/server.bundle.js
COPY ./build/static /root/static

WORKDIR /root

ENTRYPOINT ["sh", "/root/entry.sh"]
