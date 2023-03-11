const {sha256} = require('./Util.js');

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
            outData = { str: res, code: 200 };
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

                    return { str: res, code: 200 }
                }
                else {
                    return { code: 615 };
                }
            }
            else if (data.username != null) {
                let res = await this.db.pb.collection('usr').getFirstListItem(`username="${data.username}"`);
                if (res.passwordHash == data.passwordHash) {
                    await this.updateSession(res);
                    res.passwordHash = null;
                    return { str: res, code: 200 }
                }
                else {
                    return { code: 615 };
                }
            }
        } catch (e) {
            console.log(e);
            return { code: 616 };
        }
    }
    static async verify(data){
        try{
        const header = data.credHeader;
        const dat = await this.db.pb.collection('usr').getOne(header[0]);
        if(dat.username == header[1]&&dat.sessionID== header[2]){
            return {str:true,code:200};
        }
        else return {str:false,code:200};
        }catch(e){
            return {code: 616};
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