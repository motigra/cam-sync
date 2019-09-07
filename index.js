const CONST = require('./const.js');
const files = require('./photo.js');

let _start = new Date();

files.sortFiles('D:\\Photos\\New A6400', CONST.FS.MAIN_FOLDER)
.then((count) => {
    let _end = new Date();
    let span = getTimeSpan(_start, _end);
    console.log('%d photos copied in %d minutes, %d seconds, %d ms', count, span.m, span.s, span.ms);
}, (err) => {
    throw err;
});

// Helper Methods

function getTimeSpan(a, b){
    let diff = b-a;
    let _ms = diff % 1000;
    diff -= _ms;
    let _s = diff % 60000;
    diff -= _s;
    let _m = diff;
    return {
        ms: _ms,
        s: _s / 1000,
        m: _m / 60000
    };
}