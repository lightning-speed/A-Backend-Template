const {sha256} = require('./Util.js');
const Codes = require('./Code.js');


module.exports = class Auth {
    constructor() {

    }
    static async register(data, pb) {
        let outData;
        const username = data.username;
        const email = data.email;
        const passwordHash = data.passwordHash;
        try {
            const res = await this.db.pb.collection('usr').create({
                username: username,
                email: email,
                passwordHash: passwordHash,
                sessionID: createSessionID()
            });
            outData = { str: res, code: codes.sucess };
        } catch (e) {
            console.log(e);
            outData = { code: 512 };
        }
        return outData;
    }
    static async login(data, pb) {
        try {
            if (data.email != null) {
                let res = await this.db.pb.collection('usr').getFirstListItem(`email="${data.email}"`);
                if (res.passwordHash == data.passwordHash) {
                    await this.updateSession(res);

                    res.passwordHash = null;

                    return { str: res, code: codes.sucess }
                }
                else {
                    return { code: codes.unAuthorized };
                }
            }
            else if (data.username != null) {
                let res = await this.db.pb.collection('usr').getFirstListItem(`username="${data.username}"`);
                if (res.passwordHash == data.passwordHash) {
                    await this.updateSession(res);
                    res.passwordHash = null;
                    return { str: res, code: codes.sucess }
                }
                else {
                    return { code: codes.unAuthorized };
                }
            }
        } catch (e) {
            console.log(e);
            return { code: codes.notFound };
        }
    }
    static async verify(data){
        try{
        const header = data.credHeader;
        const dat = await this.db.pb.collection('usr').getOne(header[0]);
        if(dat.username == header[1]&&dat.sessionID== header[2]){
            return {str:true,code:codes.sucess};
        }
        else return {str:false,code:codes.sucess};
        }catch(e){
            return {code: codes.notFound};
        }
    }
    static async updateSession(data){
        try{
        data.sessionID = createSessionID();
        await this.db.pb.collection('usr').update(data.id,data);
        }catch(e){
            console.log(e);
        }
    }
    static setDB(db) {
        this.db = db;
    }

}

console.log(createSessionID());
function createSessionID(){
    return sha256(parseInt(Math.random()*10000000)+""+parseInt(Math.random()*10000000));
}