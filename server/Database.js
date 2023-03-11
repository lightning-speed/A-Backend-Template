const Pocketbase = require('pocketbase/cjs');
const fetch = require("cross-fetch/polyfill");
const pb = new Pocketbase("http://127.0.0.1:9001");

const { spawn } = require('child_process');




module.exports = class Database {
    constructor(server) {
        const application = spawn('./pocketbase.o', ['serve','--http','127.0.0.1:9001']);
        application.on('spawn',()=>{
            setTimeout(()=>{
                server.start();
            },2000);
            this.pb = pb;

        })
        application.stdout.on('data', (data) => {
            console.log(`PB OUT: ${data}`);

        });

        application.stderr.on('data', (data) => {
            console.error(`PB ERR: ${data}`);
        });
    }
    
}