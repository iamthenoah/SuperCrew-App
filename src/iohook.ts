'use strict'

import ioHook from 'iohook';

ioHook.on('mousemove', event => {
    console.log(event); // { type: 'mousemove', x: 700, y: 400 }
});