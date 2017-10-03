
##### VARIABLES #####

# SHELL defines the shell to use while executing recipes (default: /bin/sh)
SHELL=/bin/bash

# VPATH defines the search path for prerequisites
VPATH=doc

in_dir=doc
in_files=$(wildcard $(in_dir)/*.md)

out_dir=dist
out_files=$(subst $(in_dir)/,$(out_dir)/,$(subst .md,.html,$(in_files)))

# Templates & Temp files
template=$(in_dir)/template.html
body=$(in_dir)/body.html

# Commands
drfrank=bash drfrank.sh
pandoc=pandoc -f markdown -t html


##### RULES #####

# remake everything that needs to be updated
default: setup $(out_dir) $(out_files)

# remake everything
all: setup $(out_dir) $(out_files) npm_build

.PHONY: setup
setup:
	cp -f README.md doc/about.md

# Build doc pages
# targets: target-pattern: prereq-patterns
# $< is an auto var for the first prereq
# $* is an auto var for the stem ie %
$(out_files): $(out_dir)/%.html: $(in_dir)/%.md  $(template)

	$(pandoc) $< > $(body)
	cp -f $(template) $(out_dir)/$*.html
	sed -i '/<!--#include body-->/r '"$(body)" "$(out_dir)/$*.html"
	sed -i '/<!--#include body-->/d' "$(out_dir)/$*.html"
	rm $(body)

$(out_dir):
	mkdir -p $(out_dir)


.PHONY: npm_build
npm_build:
	npm install
	npm run build

.PHONY: clean
clean:
	rm -rf $(out_dir)/*




