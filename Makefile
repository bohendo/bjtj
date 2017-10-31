
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh

VPATH=docs:src:webpack:ops:built:built/static # search path for prereqs & targets

md_template=./docs/template.html
md_body=./docs/body.html
pandoc=pandoc -f markdown -t html
webpack=node_modules/.bin/webpack
about=docs/about.md

##### CALCULATED VARIABLES #####

v=$(shell grep "\"version\"" ./package.json | egrep -o [0-9.]* | cut -d . -f 1-2)

md=$(shell find ./docs -type f -name "*.md")
js=$(shell find ./src -type f -name "*.js*")
css=$(shell find ./src -type f -name "*.scss")

md_out=$(subst docs/,built/static/,$(subst .md,.html,$(md)))

##### RULES #####
# first rule is the default

all: mongo nodejs certbot nginx
	@true

mongo: mongo.Dockerfile mongo.entry.sh mongo.conf
	docker build -f ops/mongo.Dockerfile -t `whoami`/bjvm_mongo:$v .
	mkdir -p built && touch built/mongo

nodejs: nodejs.Dockerfile nodejs.entry.sh server.bundle.js
	docker build -f ops/nodejs.Dockerfile -t `whoami`/bjvm_nodejs:$v .
	mkdir -p built && touch built/nodejs

certbot: certbot.Dockerfile certbot.entry.sh
	docker build -f ops/certbot.Dockerfile -t `whoami`/bjvm_certbot:$v .
	mkdir -p built && touch built/certbot

nginx: nginx.Dockerfile nginx.entry.sh nginx.conf client.bundle.js style.css $(md_out)
	docker build -f ops/nginx.Dockerfile -t `whoami`/bjvm_nginx:$v .
	mkdir -p built && touch built/nginx

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
$(md_out): built/static/%.html: docs/%.md $(about) $(md_template)

	mkdir -p built/static/
	$(pandoc) $< > $(md_body)
	cp -f $(md_template) built/static/$*.html
	sed -i '/<!--#include body-->/r '"$(md_body)" "built/static/$*.html"
	sed -i '/<!--#include body-->/d' "built/static/$*.html"
	rm $(md_body)

# readme and about: same thing
$(about): README.md
	cp -f README.md $(about)

clean:
	rm -rf built/*

