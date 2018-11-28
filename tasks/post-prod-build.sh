#!/usr/bin/env sh

set -e

filename=old-ie-warn.js
tsc --allowJs --outDir dist/ -t es3 --lib esnext res/$filename

filepath=dist/$filename
uglifyjs --comments all $filepath -o $filepath -c -m
