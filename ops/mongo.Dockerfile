
FROM alpine:3.6

MAINTAINER Bo Henderson <twitter.com/bohendo>

RUN apk --update add mongodb && \
  ln -fs /dev/stdout /var/log/mongodb/mongod.log &&\
  mkdir -p /data/db

COPY ./ops/mongo.conf /etc/mongo.conf
COPY ./ops/mongo.entry.sh /root/entry.sh

VOLUME /data/db

ENTRYPOINT ["sh", "/root/entry.sh"]
