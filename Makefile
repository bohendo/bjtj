
##### MAGIC VARIABLES #####

v=latest
me=$(shell whoami)

SHELL=/bin/bash # default: /bin/sh
VPATH=client:php:ops:build:contracts:build/contracts # search path for prereqs & targets

webpack=node_modules/.bin/webpack

##### CALCULATED VARIABLES #####

# Input files
client=$(shell find client -type f)
php=$(shell find php -type f)
sol=$(shell find contracts -type f -name "*.sol")

# Output files
artifacts=$(subst contracts/,build/contracts/,$(subst .sol,.json,$(sol)))

$(shell mkdir -p build)

##### RULES #####
# first rule is the default

all: bjtjutils.js bjtj.zip
	@true

bjtj.zip: client.bundle.js $(php)
	mkdir -p build/bjtj/js/
	cp -rf php/* build/bjtj
	cp -f build/client.bundle.js build/bjtj/js/
	cd build && zip -r bjtj.zip bjtj/*
	rm -rf build/bjtj

build/bjtjutils.js: $(artifacts) ops/utils.js
	echo 'var bjtjData = ' | tr -d '\n\r' > build/bjtjutils.js
	cat build/contracts/BlackjackTipJar.json >> build/bjtjutils.js
	echo >> build/bjtjutils.js
	cat ops/utils.js >> build/bjtjutils.js

client.bundle.js: node_modules webpack.client.js $(artifacts) $(client)
	$(webpack) --config ops/webpack.client.js

test: $(artifacts)
	truffle test

$(artifacts): $(sol) node_modules
	truffle compile
	touch $(artifacts)

node_modules: package.json
	npm install

