
$(shell mkdir -p build/static)

##### MAGIC VARIABLES #####

v=latest
me=$(shell whoami)

SHELL=/bin/bash # default: /bin/sh
VPATH=src:ops:build:build/static # search path for prereqs & targets

webpack=node_modules/.bin/webpack

##### CALCULATED VARIABLES #####

# Input files
client=$(shell find client -type f)
php=$(shell find php -type f)

sol=$(shell find contracts -type f -name "*.sol")

# Output files
artifacts=$(subst contracts/,build/contracts/,$(subst .sol,.json,$(sol)))

##### RULES #####
# first rule is the default

all: dealer.js bjtj.zip
	@true

bjtj.zip: client.bundle.js $(php)
	mkdir -p build/bjtj/js/
	cp -rf php/* build/bjtj
	cp -f build/static/client.bundle.js build/bjtj/js/
	cd build && zip -r bjtj.zip bjtj/*
	rm -rf build/bjtj

deploy: dealer.js bjtj.zip
	docker push $(me)/bjtj:$v

build/dealer.js: $(artifacts) ops/preload-dealer.js ops/console.sh
	echo 'var dealerData = ' | tr -d '\n\r' > build/dealer.js
	cat build/contracts/Dealer.json >> build/dealer.js
	echo >> build/dealer.js
	cat ops/preload-dealer.js >> build/dealer.js

client.bundle.js: node_modules webpack.client.js $(artifacts) $(client)
	$(webpack) --config ops/webpack.client.js

$(artifacts): $(sol)
	truffle compile
	touch $(artifacts)

node_modules: package.json
	npm install

