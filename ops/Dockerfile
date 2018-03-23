FROM node:9.7-alpine

MAINTAINER Bo Henderson <twitter.com/bohendo>

RUN npm install -g nodemon

COPY ./ops/entry.sh /root/entry.sh
COPY ./build/nodejs.bundle.js /root/nodejs.bundle.js
COPY ./build/static /root/static

WORKDIR /root

ENTRYPOINT ["sh", "/root/entry.sh"]
