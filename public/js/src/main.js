console.log('start');

//import 'webcomponents.js/webcomponents-lite.js';
import {fwc, router} from 'fwc';
console.log('fwc', fwc);
console.log('router', router);

fwc('kitem')
    .on('create', () => console.log('create'))
    .register();
