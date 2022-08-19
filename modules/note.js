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
            let noteToken = this.generateToken(10);

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
                this.db.query(`INSERT INTO notes (private_key, content, forwhen, created, token) VALUES ('${private_key}', '${content}', '${forwhen}', '${created}', '${noteToken}')`);
            });
            return {
                status: true,
                message: 'Note added successfully',
                noteId: noteToken
            };
        } catch (err) {
            return {
                status: false,
                message: err
            };
        }
    }
    get(token) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT private_key FROM users WHERE token = '${token}'`, (err, result) => {
                if (err) {
                    reject({
                        status: false,
                        message: err
                    });
                }
                if (result.length === 0) {
                    reject({
                        status: false,
                        message: 'utilisateur non trouvé'
                    });
                }
                let private_key = result[0].private_key;
                this.db.query(`SELECT content, forwhen, created, token FROM notes WHERE private_key = '${private_key}' ORDER BY id DESC`, (err, result) => {
                    if (err) {
                        reject({
                            status: false,
                            message: err
                        });
                    }
                    resolve({
                        status: true,
                        message: 'Notes trouvés',
                        notes: result
                    });
                });
            });
        });
    }
    delete(token, noteId) {
        try {
            this.db.query(`SELECT private_key FROM users WHERE token = '${token}'`, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.length === 0) {
                    throw new Error('User not found');
                }
                let private_key = result[0].private_key;
                this.db.query(`DELETE FROM notes WHERE private_key = '${private_key}' AND token = '${noteId}'`);
            });
            return {
                status: true,
                message: 'Note supprimée avec succès'
            };
        } catch (err) {
            return {
                status: false,
                message: err
            };
        }
    }
}

module.exports = Note;