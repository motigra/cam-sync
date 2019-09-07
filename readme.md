# Sony A6400 Storage Helper

## Description

Various utilities for managing the images on my Sony Alpha 6400 camera

 - Detect the camera being connected via USB as a media storage device
 - Organize files in folders by date taken
 - Catalogue photos in CSV format with EXIF information

## TODO

 - File sorting mechanism
    - Make it work as a CLI
    - Improve efficiency by caching `ensureFolder`
 - USB detection
    - Move detection constants to separate file
    - Make it work as a library
    - Ensure correct media by contents
 - Catalog
    - Implement CSV mechanism
 - Convert to windows service