#!/bin/bash

# This script converts SVG files to PNG format
rsvg-convert -w 512 -h 512 ./icons/icon.svg -o ./icons/icon-512x512.png
rsvg-convert -w 192 -h 192 ./icons/icon.svg -o ./icons/icon-192x192.png