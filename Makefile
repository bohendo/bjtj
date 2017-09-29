
##### VARIABLES #####

# SHELL defines the shell to use while executing recipes (default: /bin/sh)
SHELL=/bin/bash

# VPATH defines the search path for prerequisites
VPATH=doc

# Lists of files
include_html=$(wildcard client/include/*.html)

posts_dir=$(HOME)/Dropbox/Documents/posts
posts_in=$(subst $(posts_dir),posts,$(wildcard $(posts_dir)/*.md))
posts_out=$(subst posts/,static/,$(subst .md,.html,$(posts_in)))

less_in=$(wildcard client/*.less) $(wildcard client/**/*.less)
less_out=$p/style.css

pages_in=$(wildcard client/pages/*.html)
pages_out=$(subst client/pages/,static/,$(pages_in))

data_in=$(wildcard data/*)
data_out=$(subst data/,static/,$(data_in))


# Templates & Temp files
blog_template=client/blog-template.html
blog_body=client/include/blog-body.html
less_index=client/index.less

# output directory
p=static
static=/var/www/static

# Commands
drfrank=bash drfrank.sh
pandoc=pandoc -f markdown -t html
lessc=node_modules/less/bin/lessc

# Canary files whose absence indicate we need to run `npm install`
bootstrap_css=node_modules/bootstrap/dist/css/bootstrap.min.css
node_modules=$(lessc) $(bootstrap_css)
  

##### RULES #####

#debug:
#	@echo posts in: $(posts_in)
#	@echo posts out: $(posts_out)
#	@echo pages in: $(pages_in)
#	@echo pages out: $(pages_out)

# remake everything that needs to be updated
default: ln_setup npm_install $(pages_out) $(posts_out) $(less_out) $(data_out) tidy

# remake everything
all: clean ln_setup npm_install $(pages_out) $(posts_out) $(less_out) $(data_out) tidy


# execute npm install if necessary
# @prefix means don't echo this line
.PHONY: npm_install
npm_install:
	@for nm in $(node_modules);\
	  do if [[ ! -f $$nm ]]; then npm install; exit; fi;\
	done


# Setup appropriate symbolic links
# @means don't echo output
.PHONY: ln_setup
ln_setup:
	@ln -fTs $(static) $p
	@ln -fTs $(posts_dir) posts


# Build main pages
$(pages_out): $p/%: % $(include_html)
	cp -f $< $p/$(notdir $@)
	$(drfrank) $p/$(notdir $@)


# Build blog posts
# targets: target-pattern: prereq-patterns
# $< is an auto var for the first prereq
# $* is an auto var for the stem ie %
$(posts_out): $p/%.html: posts/%.md $(include_html) $(blog_template)
	$(pandoc) $< > $(blog_body)
	cp -f $(blog_template) $p/$*.html
	$(drfrank) $p/$*.html


# Build stylesheet
# make turns $$ into a single $ for bash to interpret
$(less_out): $(less_in)
	cp -f $(bootstrap_css) $@
	touch $(less_index)
	for lf in $(less_in);\
	  do echo "@import \"$$lf\";" >> $(less_index);\
	done
	$(lessc) $(less_index) >> $@


# copy over data files
$(data_out): $p/%: %
	cp data/$* $p/$*


# @prefix means don't echo this line
.PHONY: tidy
tidy:
	@if [[ -f $(blog_body) ]]; then rm $(blog_body); fi
	@if [[ -f $(less_index) ]]; then rm $(less_index); fi

.PHONY: clean
clean:
	rm static/*

