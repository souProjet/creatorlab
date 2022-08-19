let Note = class Note {
    constructor(db) {
        this.db = db;
    }
    generateToken(length = 20) {
        let token = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    add(token, content, forwhen) {
        try {
            this.db.query(`SELECT private_key FROM users WHERE token = '${token}'`, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.length === 0) {
                    throw new Error('User not found');
                }
                let private_key = result[0].private_key;
                let date = new Date();
                let created = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                let noteToken = this.generateToken(10);
                this.db.query(`INSERT INTO notes (private_key, content, forwhen, created, token) VALUES ('${private_key}', '${content}', '${forwhen}', '${created}', '${noteToken}')`);
            });
            return true;
        } catch (err) {
            return false;
        }
    }
}

module.exports = Note;