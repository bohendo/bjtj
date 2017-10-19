FROM node

MAINTAINER twitter.com/bohendo

RUN mkdir -p /app

WORKDIR /app

EXPOSE 3000

ADD ./built/server.bundle.js /app

CMD ["node", "/app/server.bundle.js"]
