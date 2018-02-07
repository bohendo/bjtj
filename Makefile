
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh

VPATH=docs:src:webpack:ops:build:build/static # search path for prereqs & targets

$(shell mkdir -p ./build)

md_template=./docs/template.html
md_body=./docs/body.html
pandoc=pandoc -f markdown -t html
webpack=node_modules/.bin/webpack
about=docs/about.md

##### CALCULATED VARIABLES #####

#v=$(shell grep "\"version\"" ./package.json | egrep -o [0-9.]*)
v=latest

# Input files
md=$(shell find ./docs -type f -name "*.md")
js=$(shell find ./src -type f -name "*.js*")
css=$(shell find ./src -type f -name "*.scss")
sol=$(shell find ./contracts -type f -name "*.sol")
migrations=$(shell find ./migrations -type f -name "*.js")

# Output files
artifacts=$(subst contracts/,build/contracts/,$(subst .sol,.json,$(sol)))
md_out=$(subst docs/,build/static/,$(subst .md,.html,$(md)))

##### RULES #####
# first rule is the default

all: mongo-image nodejs-image nodemon-image nginx-image
	@true

deploy: mongo-image nodejs-image nodemon-image nginx-image
	docker push `whoami`/bjvm_mongo:$v
	docker push `whoami`/bjvm_nodejs:$v
	docker push `whoami`/bjvm_nginx:$v

mongo: mongo-image
	docker push `whoami`/bjvm_mongo:$v
	touch build/mongo-image

nodejs: nodejs-image
	docker push `whoami`/bjvm_nodejs:$v
	touch build/nodejs-image

nodemon: nodemon-image
	docker push `whoami`/bjvm_nodemon:$v
	touch build/nodemon-image

nginx: nginx-image
	docker push `whoami`/bjvm_nginx:$v
	touch build/nginx-image

build/mongo-image: mongo.Dockerfile mongo.entry.sh mongo.conf
	docker build -f ops/mongo.Dockerfile -t `whoami`/bjvm_mongo:$v -t bjvm_mongo:$v .
	touch build/mongo-image

build/nodejs-image: nodejs.Dockerfile server.bundle.js
	docker build -f ops/nodejs.Dockerfile -t `whoami`/bjvm_nodejs:$v -t bjvm_nodejs:$v .
	touch build/nodejs-image

build/nodemon-image: nodemon.Dockerfile
	docker build -f ops/nodemon.Dockerfile -t `whoami`/bjvm_nodemon:$v -t bjvm_nodemon:$v .
	touch build/nodemon-image

build/nginx-image: nginx.Dockerfile nginx.entry.sh nginx.conf client.bundle.js style.css $(md_out)
	docker build -f ops/nginx.Dockerfile -t `whoami`/bjvm_nginx:$v -t bjvm_nginx:$v .
	touch build/nginx-image

$(artifacts): $(sol) $(migrations)
	truffle compile
	truffle migrate

server.bundle.js: node_modules $(artifacts) webpack/server.config.js $(js)
	$(webpack) --config webpack/server.config.js

client.bundle.js: node_modules $(artifacts) webpack/client.common.js webpack/client.prod.js $(js)
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

