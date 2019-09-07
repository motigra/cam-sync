const usb = require('usb');
const si = require('systeminformation');

function isSimilarNumber(x,y) {
    return (Math.abs((y/x) - (x/y)) < 0.01);
}

usb.on('attach', (device) => {

    if(!(device.deviceDescriptor.idVendor == 1356 && device.deviceDescriptor.idProduct == 3240))
        return;

    console.log('detected sony usb drive connection');

    si.diskLayout((disks) => {

        let sonyDisks = disks.filter((item) => {
            return item.name == 'Sony DSC USB Device';
        });

        if(!sonyDisks.length)
            return;

        console.log('found sony DSC USB Devices');

        let diskSize = Math.max(...sonyDisks.map((item) => {
            return item.size;
        }));
        
        si.blockDevices((blockDevices) => {

            let matchingDevices = blockDevices.filter((item) => {
                return item.fstype == 'exfat' && item.removable && isSimilarNumber(diskSize, item.size*1);
            });

            if(!matchingDevices.length)
                return;

            console.log('found removable drives of matching size');

            if(matchingDevices.length == 1)
                console.log('matching device letter: ' + matchingDevices[0].mount);
            else
                throw 'found multiple matching devices';

        });
    });
});