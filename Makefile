
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh
VPATH=src:ops:build:build/static # search path for prereqs & targets

$(shell mkdir -p build/static)

webpack=node_modules/.bin/webpack


##### CALCULATED VARIABLES #####

#v=$(shell grep "\"version\"" package.json | egrep -o [0-9.]*)
v=latest

# Input files
js=$(shell find src -type f -name "*.js*")
css=$(shell find src -type f -name "*.scss")
sol=$(shell find contracts -type f -name "*.sol")

# Output files
artifacts=$(subst contracts/,build/contracts/,$(subst .sol,.json,$(sol)))

##### RULES #####
# first rule is the default

all: nodejs-image
	@true

deploy: nodejs-image
	docker push `whoami`/bjvm_nodejs:$v

nodejs: nodejs-image
	docker push `whoami`/bjvm_nodejs:$v

build/nodejs-image: nodejs.Dockerfile server.bundle.js client.bundle.js style.css
	docker build -f ops/nodejs.Dockerfile -t `whoami`/bjvm_nodejs:$v -t bjvm_nodejs:$v .
	touch build/nodejs-image

server.bundle.js: node_modules webpack.server.js $(js) $(artifacts)
	$(webpack) --config ops/webpack.server.js

client.bundle.js: node_modules webpack.client.js $(js)
	$(webpack) --config ops/webpack.client.js

style.css: node_modules $(css)
	$(webpack) --config ops/webpack.client.js

$(artifacts): $(sol)
	truffle compile

node_modules: package.json package-lock.json
	npm install

clean:
	rm -rf node_modules build
