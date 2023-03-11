const express = require('express');
const app = express();
const Database = require('./Database');
const Auth = require('./Auth');
const Codes = require('./Code.js');
let database;
let currentServingIPS = [];
let startTime = new Date();

module.exports = class Server {
    constructor() {
        app.use(express.static('public'));
        app.use(express.json());
        const serve = async (req, res) => {
            const ip = req.socket.remoteAddress;
            if (currentServingIPS.includes(ip)) {
                res.status(Codes.rejectedLimit);
                res.send({});
                console.log(currentServingIPS);
                return;
            }
            currentServingIPS.push(ip);
            try {
                console.log("hey")
                const reqData = req.body;
                reqData.ip = ip;
                const method = req.method;
                const data = await this.serveRequest(method, reqData);
                if (data['code'] != null)
                    res.status(data.code);
                res.send(data.str);
                currentServingIPS.splice(currentServingIPS.indexOf(ip), 1);
            } catch (e) {
                console.log(e);
            }
        };
        app.post('/api', serve);
        app.get('/api', serve);
        database = new Database(this);
        Auth.setDB(database);
    }
    start() {
        app.listen(3000, () => {
            console.log('Server started on port 3000');
        });
    }
    async serveRequest(method, data) {
        let returnData = {};
        if (method == 'POST') {
            switch (data.type) {
                case 'reg':
                    returnData = await Auth.register(data);
                    break;
                case 'auth':
                    returnData = Auth.login(data);
                    break;
                case 'verify':
                    returnData = await Auth.verify(data);
                    break;
                default:
                    returnData = { code: codes.notFound};
            }
        } else if (method == 'GET') {

        }
        console.log('New Request: ' + method);
        console.log(data);
        return returnData;
    }
    uptime() {
        return new Date().getTime() - startTime.getTime();
    }
}