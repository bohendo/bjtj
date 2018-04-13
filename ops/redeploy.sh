#!/bin/bash

docker service rm blog_proxy blog_wordpress

make

bash ops/deploy.sh
