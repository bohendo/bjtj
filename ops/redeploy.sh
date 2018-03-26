#!/bin/bash

docker service rm blog_proxy blog_wordpress

make deploy

bash ops/dev-blog.sh
