FROM node:8.8-alpine

MAINTAINER Bo Henderson <twitter.com/bohendo>

COPY ./built/server.bundle.js /root/server.bundle.js

ENTRYPOINT ["node", "/root/server.bundle.js"]
