let User = class User {
    constructor(db) {
        this.db = db;
    }
    getSocketIdByToken(token) {
        //Retourner une promesse qui contient l'id du socket
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE token = '${token}'`, (err, rows) => {
                if (err) {
                    reject({
                        status: false,
                        message: err
                    });
                } else {
                    if (rows.length > 0) {
                        resolve({
                            status: true,
                            socketId: rows[0].socketid
                        });
                    } else {
                        reject({
                            status: false,
                            message: 'Aucun utilisateur trouvé'
                        });
                    }
                }
            });
        });
    }
}
module.exports = User;