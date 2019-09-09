/** Imports */

const fs = require('fs');
const detect = require('./detect.js');
const util = require('util');

/** Detect USB device */

detect('attach', (driveLetter) => {

    console.log("Sony A6400 Camera Storage device detected on drive %s", driveLetter);

    let sourcePath = util.format('%s\\DCIM', driveLetter);
    let t = new Date();
    let targetPath = util.format('D:\\Photos\\extract-%s-%s-%s-%s-%s-%s',t.getFullYear(),t.getMonth()+1,t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds());

    copyFile(sourcePath, targetPath)
    .then(() => {
        console.log('Files downloaded automatically from camera!');
    }, (err) => {
        throw err;
    })

});

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