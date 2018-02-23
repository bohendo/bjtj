FROM alpine:3.6

MAINTAINER Bo Henderson <twitter.com/bohendo>

# initialize a stronger dhparam (separate RUN so dhparam gets cached)
RUN apk add --update nginx

RUN ln -fs /dev/stdout /var/log/nginx/access.log && \
    ln -fs /dev/stderr /var/log/nginx/error.log

COPY ./ops/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx"]
