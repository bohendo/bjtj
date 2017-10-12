
##### MAGIC VARIABLES #####

# SHELL defines the shell to use while executing recipes
# (default: /bin/sh)
SHELL=/bin/bash

# VPATH = search path for prerequisites
VPATH=docs:src:webpack

out_dir=build/public
source=src

md_dir=docs
md_template=$(md_dir)/template.html
md_body=$(md_dir)/body.html

# Commands
drfrank=bash drfrank.sh
pandoc=pandoc -f markdown -t html
webpack=node_modules/.bin/webpack

about=docs/about.md

##### CALCULATED VARIABLES #####

md_out=$(subst $(md_dir)/,$(out_dir)/,$(subst .md,.html,$(md_in)))

# fe for Front End
md=$(shell find $(md_dir) -type f -name "*.md")
js=$(shell find $(source) -type f -name "*.js")
css=$(shell find $(source) -type f -name "*.s?css")

##### RULES #####
# first rule is the default

dev: client server $(md_out)

client: $(js) $(css)
	$(webpack) --config webpack/client.dev.js

.PHONY: server
server: $(js)
	$(webpack) --config webpack/server.dev.js

prod: client-prod server-prod $(md_out)
  
client-prod: $(js) $(css)
	$(webpack) --config webpack/client.prod.js

server-prod: $(js)
	$(webpack) --config webpack/server.prod.js

# readme and about: same thing
$(about): README.md
	cp -f README.md $(about)

# Build docs pages
# targets: target-pattern: prereq-patterns
# $< is an auto var for the first prereq
# $* is an auto var for the stem ie %
$(md_out): $(md_dir)/%.html: $(md_dir)/%.md $(about) $(md_template)

	mkdir -p $(out_dir)
	$(pandoc) $< > $(md_body)
	cp -f $(md_template) $(out_dir)/$*.html
	sed -i '/<!--#include body-->/r '"$(md_body)" "$(out_dir)/$*.html"
	sed -i '/<!--#include body-->/d' "$(out_dir)/$*.html"
	rm $(md_body)

node_modules: package.json
	npm install

clean:
	rm -rf $(out_dir)/*

