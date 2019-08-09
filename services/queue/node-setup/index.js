/* eslint-disable */
'use strict';

/*
#
### DEFINE ENVIROMENT
#
*/

var boot
if (process.env.NODE_ENV === 'production') {
    require('@babel/polyfill');
    boot = require('./build/src/boot').default()
} else {
    require('@babel/polyfill');
    require('@babel/register');
    boot = require('./src/boot').default()
}

/*
#
### BOOT NODE
#
*/

boot.catch(function (err) {
    console.log('*** BOOT: Fatal Error');
    console.log(err);
});

// Let Docker exit on Ctrl+C
process.on('SIGINT', function() {
    process.exit();
});
