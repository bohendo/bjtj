
##### MAGIC VARIABLES #####

SHELL=/bin/bash # default: /bin/sh
VPATH=docs:src:webpack:ops # search path for prereqs
out_dir=built/static
source=src
md_dir=docs
md_template=$(md_dir)/template.html
md_body=$(md_dir)/body.html
drfrank=bash drfrank.sh
pandoc=pandoc -f markdown -t html
webpack=node_modules/.bin/webpack
about=docs/about.md

##### CALCULATED VARIABLES #####

md=$(shell find $(md_dir) -type f -name "*.md")
js=$(shell find $(source) -type f -name "*.js")
css=$(shell find $(source) -type f -name "*.s?css")

md_out=$(subst $(md_dir)/,$(out_dir)/,$(subst .md,.html,$(md)))

##### RULES #####
# first rule is the default

prod: node_modules client-prod server-prod $(md_out)
  
client-prod: $(js) $(css)
	$(webpack) --config webpack/client.prod.js

server-prod: $(js)
	$(webpack) --config webpack/server.prod.js

dev: node_modules client-dev server-dev $(md_out)

client-dev: $(js) $(css)
	$(webpack) --config webpack/client.dev.js

server-dev: $(js)
	$(webpack) --config webpack/server.dev.js
# readme and about: same thing
$(about): README.md
	cp -f README.md $(about)

# Build docs pages
# targets: target-pattern: prereq-patterns
# $< is an auto var for the first prereq
# $* is an auto var for the stem ie %
$(md_out): $(out_dir)/%.html: $(md_dir)/%.md $(about) $(md_template)

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

nginx: nginx.Dockerfile nginx.conf
	docker build -f ops/nginx.Dockerfile -t bohendo/nginx .

node: node.Dockerfile
	docker build -f ops/node.Dockerfile -t bohendo/node .

