const fs = require('fs');
const exif = require('jpeg-exif');
const util = require('util');

const folder = 'D:\\Photos\\New A6400';

const dest = 'D:\\Photos';

const jpegRegex = /\.jp(e?)g$/i;
const exifDateRegex = /\d{2,4}/g;

function ensureFolder(dirName) {
    return new Promise((resolve, reject) => {

        let innerP = new Promise((resolve2, reject2) => {

            let fullPath = util.format('%s\\%s', dest, dirName);
            fs.exists(fullPath, (exists) => {
                if(exists) {
                    //console.log('folder %s exists', fullPath);
                    resolve2(fullPath);
                }
                else {
                    console.log('creating folder %s', fullPath);
                    fs.mkdir(fullPath, (err) => {
                        if(err)
                            reject2(err);
                        else
                            resolve2(fullPath);
                    });
                }
            });
        });

        innerP.then((fullPath) => {
            //console.log('ensuring permissions for folder %s', fullPath);
            //fs.chmod(fullPath, 0o777, (err) => {
            //    if(err)
           //         reject(err);
            //    else
                    resolve(fullPath);
            //});
        });
    });
}

fs.readdir(folder, (err, files) => {

    let jpegs = files.filter((item) => {
        return jpegRegex.test(item);
    });

    console.log('Folder %s contains %d JPEG files', folder, jpegs.length);

    let catalogue = {};

    let promises = [];

    jpegs.forEach((item) => {

        promises.push(new Promise((resolve, reject) => {

            let filePath = util.format('%s\\%s', folder, item);

            exif.parse(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    
                    let dateParts = data.DateTime.match(exifDateRegex);
                    let date = util.format('%s-%s-%s', dateParts[0], dateParts[1], dateParts[2]);

                    catalogue[date] = catalogue[date] || [];
                    catalogue[date].push(filePath);

                    ensureFolder(date).then((dirPath) => {
                        
                        let destFullPath = util.format('%s\\%s', dirPath, item);

                        fs.copyFile(filePath, destFullPath, (err) => {
                            if(err)
                                reject(err);
                            else
                                resolve();
                        })

                    });

                    //resolve();
                }
            });

        }));

    });

    Promise.all(promises).then(() => {

        console.log('done processing folder');

        let c = 0;

        let dates = Object.keys(catalogue);

        console.log('total %d dates found', dates.length);

        dates.forEach((key) => {
            c += catalogue[key].length;
        });

        console.log('sorted %d photos into dates catalog', c);

        console.log(catalogue);

    }, (err) => {
        throw err;
    });

}); 
