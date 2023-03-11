

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
                const res = await this.db.pb.collection('usr').getFirstListItem(`email="${data.email}"`);
                if (res.passwordHash == data.passwordHash) {
                    return { str: res, code: 200 }
                }
                else {
                    return { code: 615 };
                }
            }
            else if (data.username != null) {
                const res = await this.db.pb.collection('usr').getFirstListItem(`username="${data.username}"`);
                if (res.passwordHash == data.passwordHash) {
                    res.passwordHash = null;
                    return { str: res, code: 200 }
                }
                else {
                    return { code: 615 };
                }
            }
        } catch (e) {
            return { code: 616 };
        }
    }
    static async verify(data){
        const header = data.credHeader;
        const dat = await this.db.pb.collection('usr').getOne(header[0]);
        if(dat.username == header[1]&&dat.passwordHash== header[2]){
            return true;
        }
        else return false;
    }
    static setDB(db) {
        this.db = db;
    }
}


function createSessionID(){
    sha256()
}