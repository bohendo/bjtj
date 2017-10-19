FROM ubuntu:xenial

MAINTAINER twitter.com/bohendo

RUN apt-get update -y

RUN apt-get install -y curl apt-utils

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get install -y python build-essential nodejs

RUN npm install -g nodemon

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
ADD . /app

EXPOSE 3000

CMD ["nodemon", "/app/build/server.bundle.js"]
