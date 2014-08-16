# Canvas Thumber

Creates a set of thumbnails from a set of dropped image, downloadable as a zip.

## Demo

You can check the github pages version: https://codepo8.github.io/canvasthumber/

And there is a video demo on the YouTubes: TODO

## Requirements and support

Uses Stuart Knightley's JSZip: http://stuk.github.io/jszip/
and Eli Grey's FileSaver: https://github.com/eligrey/FileSaver.js/

It was tested in Chrome, Firefox, Opera and Safari on OSX. I also showed it to a cat and it approved.

## How to use

Start by dropping some images on the grey box and you will see the generated thumbnails. Hovering over the thumbnails shows you their file names and size and clicking them removes them from the collection. 

You can download them all in Zip format by clicking the "Download as Zip" button.

The thumbnails are the same name as the original pictures followed by "_tn".

You can select a few options how to generate the thumbnails:

* They can be on a coloured background or transparent
* They can be cropped to their size instead of being the thumbnail size
* You can define the thumbnail size
* You can force a conversion to JPG for all of them - this results in smaller files but affects their quality. You can define the quality percentage - lower values result in more blurry images. 