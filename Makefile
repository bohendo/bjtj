
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh

VPATH=docs:src:webpack:ops:build:build/static # search path for prereqs & targets

md_template=./docs/template.html
md_body=./docs/body.html
pandoc=pandoc -f markdown -t html
webpack=node_modules/.bin/webpack
about=docs/about.md

##### CALCULATED VARIABLES #####

v=$(shell grep "\"version\"" ./package.json | egrep -o [0-9.]*)

md=$(shell find ./docs -type f -name "*.md")
js=$(shell find ./src -type f -name "*.js*")
css=$(shell find ./src -type f -name "*.scss")

md_out=$(subst docs/,build/static/,$(subst .md,.html,$(md)))

##### RULES #####
# first rule is the default

all: mongo nodejs nodemon nginx certbot
	@true

deploy: mongo nodejs nodemon nginx certbot
	docker build -f ops/mongo.Dockerfile -t `whoami`/bjvm_mongo:$v .
	docker push `whoami`/bjvm_mongo:$v
	docker build -f ops/nodejs.Dockerfile -t `whoami`/bjvm_nodejs:$v .
	docker push `whoami`/bjvm_nodejs:$v
	docker build -f ops/nginx.Dockerfile -t `whoami`/bjvm_nginx:$v .
	docker push `whoami`/bjvm_nginx:$v
	docker build -f ops/certbot.Dockerfile -t `whoami`/bjvm_certbot:$v .
	docker push `whoami`/bjvm_certbot:$v

mongo: mongo.Dockerfile mongo.entry.sh mongo.conf
	docker build -f ops/mongo.Dockerfile -t `whoami`/bjvm_mongo:latest -t bjvm_mongo:latest .
	mkdir -p build && touch build/mongo

nodejs: nodejs.Dockerfile server.bundle.js
	docker build -f ops/nodejs.Dockerfile -t `whoami`/bjvm_nodejs:latest -t bjvm_nodejs:latest .
	mkdir -p build && touch build/nodejs

nodemon: nodemon.Dockerfile
	docker build -f ops/nodemon.Dockerfile -t `whoami`/bjvm_nodemon:latest -t bjvm_nodemon:latest .
	mkdir -p build && touch build/nodemon

nginx: nginx.Dockerfile nginx.entry.sh nginx.conf client.bundle.js style.css $(md_out)
	docker build -f ops/nginx.Dockerfile -t `whoami`/bjvm_nginx:latest -t bjvm_nginx:latest .
	mkdir -p build && touch build/nginx

certbot: certbot.Dockerfile certbot.entry.sh
	docker build -f ops/certbot.Dockerfile -t `whoami`/bjvm_certbot:latest -t bjvm_certbot:latest .
	mkdir -p build && touch build/certbot

server.bundle.js: node_modules webpack/server.config.js $(js)
	$(webpack) --config webpack/server.config.js

client.bundle.js: node_modules webpack/client.common.js webpack/client.prod.js $(js)
	$(webpack) --config webpack/client.prod.js

style.css: node_modules $(css)
	$(webpack) --config webpack/client.prod.js

node_modules: package.json package-lock.json
	npm install

# Build docs pages
# targets: target-pattern: prereq-patterns
# $< is an auto var for the first prereq
# $* is an auto var for the stem ie %
$(md_out): build/static/%.html: docs/%.md $(about) $(md_template)

	mkdir -p build/static/
	$(pandoc) $< > $(md_body)
	cp -f $(md_template) build/static/$*.html
	sed -i '/<!--#include body-->/r '"$(md_body)" "build/static/$*.html"
	sed -i '/<!--#include body-->/d' "build/static/$*.html"
	rm $(md_body)

# readme and about: same thing
$(about): README.md
	cp -f README.md $(about)

clean:
	rm -rf build/*

