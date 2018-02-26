#!/bin/bash

name=blog_mysql

id=`for f in $(docker service ps -q $name)
do
  docker inspect --format '{{.Status.ContainerStatus.ContainerID}}' $f
done | head -n1`

echo "Found $name container: $id"

docker exec -it $id bash -c 'mysql -u wordpress -p`cat /run/secrets/wp_mysql` wordpress'

