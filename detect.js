/** Imports */

const usb = require('usb');
const si = require('systeminformation');

/** Exports */

module.exports = listen;

/** Main function */

function listen(event = 'attach', handler) {
    usb.on(event, (device) => {

        if(!(device.deviceDescriptor.idVendor == 1356 && device.deviceDescriptor.idProduct == 3240))
            return;
    
        console.log('detected sony usb drive connection');

        getDisk('Sony DSC USB Device')
        .then((disks) => {
            if(!disks || !disks.length) return;
            let diskSize = Math.max(...disks.map((item) => {
                return item.size;
            }));
            getDevice(diskSize)
            .then((device) => {
                if(!device) return;
                handler(device);
            });
        });
    });
}

/** Inner Functions */

function isSimilarNumber(x,y) {
    return (Math.abs((y/x) - (x/y)) < 0.01);
}

function getDisk(name) {
    return new Promise((resolve, reject) => {
        try {
            si.diskLayout((disks) => {

                let sonyDisks = disks.filter((item) => {
                    return item.name == name;
                });
        
                if(!sonyDisks.length){
                    resolve(null);
                } else {
                    console.log('found "%s" USB Devices', name);
                    resolve(sonyDisks);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getDevice(diskSize) {
    return new Promise((resolve, reject) => {
        try {
            si.blockDevices((blockDevices) => {

                let matchingDevices = blockDevices.filter((item) => {
                    return item.fstype == 'exfat' && item.removable && isSimilarNumber(diskSize, item.size*1);
                });

                if(!matchingDevices.length)
                    resolve(null);

                console.log('found removable drives of matching size');

                if(matchingDevices.length == 1) {
                    console.log('matching device letter: ' + matchingDevices[0].mount);
                    resolve(matchingDevices[0].mount);
                }
                else {
                    reject('found multiple matching devices');
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}