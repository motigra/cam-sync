// Imports
const fs = require('fs');
const exif = require('jpeg-exif');
const util = require('util');
const CONST = require('./const.js');

// Exports
module.exports = {
    sortFiles
}

// Main Functions

/**
 * Sort JPEG files into directories by date
 * @param {string} sourceDir 
 * @param {string} destDir 
 */
function sortFiles(sourceDir = 'D:\\Photos\\New A6400', destDir = CONST.FS.MAIN_FOLDER) {

    console.log('Sorting files from origin "%s" to destination "%s"', sourceDir, destDir);

    let c = 0;

    return getJpegsInFolder(sourceDir)
    .then((jpegs) => {

        console.log('Folder "%s" contains %d JPEG files', sourceDir, jpegs.length);

        // Process each file in async mode
        let promises = jpegs.map((jpegFile) => {

            let sourceFilePath = util.format('%s\\%s', sourceDir, jpegFile);

            return getExif(sourceFilePath)
            .then((exifData) => {
                let date = getDateFromExif(exifData);
                return date;
            })
            .then((date) => {
                return ensureFolder(date, destDir);
            })
            .then((fullDestDir) => {
                    
                let destFilePath = util.format('%s\\%s', fullDestDir, jpegFile);

                return copyFile(sourceFilePath, destFilePath);
            })
            .then(() => {
                c++;
            });

        });

        // Resolve when all files have been processed
        return Promise.all(promises);
    })
    .then(() => {
        console.log('Done sorting files');
        return c;
    }, (err) => {
        throw err; 
    });
}

//let catalogue = {};
//catalogue[date] = catalogue[date] || [];
//catalogue[date].push(filePath);
//console.log('done processing folder');
//let c = 0;
//let dates = Object.keys(catalogue);
//console.log('total %d dates found', dates.length);
//dates.forEach((key) => {
//    c += catalogue[key].length;
//});
//console.log('sorted %d photos into dates catalog', c);
//console.log(catalogue);

// Helper Functions

/**
 * Ensure a directory exists in a given folder, create if it doesn't
 * @param {string} dirName Name of directory
 */
function ensureFolder(dirName, inPath) {
    return new Promise((resolve, reject) => {
        let fullPath = util.format('%s\\%s', inPath, dirName);
        fs.exists(fullPath, (exists) => {
            if(exists) {
                resolve(fullPath);
            }
            else {
                fs.mkdir(fullPath, (err) => {
                    if(err)
                        reject(err);
                    else
                        resolve(fullPath);
                });
            }
        });
    });
}

/**
 * Returns a list of JPEG files in a folder
 * @param {string} folder Folder to look in
 */
function getJpegsInFolder(folder = '') {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            if(err) {
                reject(err);
            }
            else {
                let jpegs = files.filter((item) => {
                    return CONST.FS.REGEX.JPEG_EXT.test(item);
                });
                resolve(jpegs);
            }
        }); 
    });
}

/**
 * Get the EXIF information from a JPEG
 * @param {string} filePath 
 */
function getExif(filePath = '') {
    return new Promise((resolve, reject) => {
        exif.parse(filePath, (err, data) => {
            if (err)
                reject(err);
            else 
                resolve(data);
        });
    });
}

/**
 * Get the date the photo was taken from EXIF data
 * @param {object} data File's EXIF data 
 */
function getDateFromExif(data = {}) {
    let dateParts = data.DateTime.match(CONST.FS.REGEX.EXIF_DATE);
    let date = util.format('%s-%s-%s', dateParts[0], dateParts[1], dateParts[2]);
    return date;
}

/**
 * Copy a file from place to place
 * @param {string} src 
 * @param {string} dest 
 */
function copyFile(src = '', dest = '') {
    return new Promise((resolve, reject) => {
        fs.copyFile(src, dest, (err) => {
            if(err)
                reject(err);
            else {
                console.log('Copied "%s" -> "%s"', src, dest);
                resolve(true);
            }
        })
    });
}