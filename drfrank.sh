
#!/bin/bash

##############################
##  Setup Environment
##############################

# clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# quick sanity check
if [[ ! -f $1 ]]; then err "couldn't find file $1"; fi

root="$HOME/Documents/blog"

include=`find -L $root -type d -name "include"`
public=`find -L $root -type d -name "public"`


##############################
##  Stitch our monster together
##############################

while true; do

    # identify the first snippet id in $1
    snippet=`egrep -o -m1 "<!--#include .*-->" $1 | sed 's/<\!--#include //' | sed 's/-->//'`

    # didn't find a snippet? We're done
    if [[ $snippet == "" ]]; then break; fi

    # find the file that is associated with this snippet
    snipfile=`find $include -name "$snippet"`

    # were we able to find a snipfile?!
    if [[ ! -f $snipfile ]]; then err "couldn't find snipfile for $1"; fi

    # dump the contents of $snipfile right after it's include comment
    sed -i '/<!--#include '"$snippet"'-->/r '"$snipfile" "$1"

    # remove this include comment, we're done with it!
    sed -i '/<!--#include '"$snippet"'-->/d' "$1"

done

