let Login = class Login {
    constructor(puppeteer, db, fetch) {
        this.puppeteer = puppeteer;
        this.db = db;
        this.fetch = fetch;
        this.checkSessionIdReturn = {
            status: false,
            message: 'Une erreur est survenue'
        }
        this.getSessionIdReturn = {
            status: false,
            message: 'Une erreur est survenue'
        }
    }
    generateToken(length = 20) {
        let token = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    createUser(username, sessionId) {
        //insère un nouvel utilisateur dans la base de données
        return new Promise((resolve, reject) => {
            let token = this.generateToken();
            let private_key = this.generateToken();
            this.db.query(`INSERT INTO users (private_key, token, username, avatar, clientId, name, socketid, antiforgery_token) VALUES ('${private_key}', '${token}', '${username}', '', '${sessionId}', '', '', '')`, (err, result) => {
                if (err) {
                    reject({
                        status: false,
                        message: 'Une erreur est survenue'
                    });
                } else {
                    resolve({
                        status: true,
                        message: 'Utilisateur créé avec succès',
                        token: token
                    });
                }
            });
        });
    }
    loginToFranceConnect(username, password) {
        //retourne une promise contenant le cookie de session (ASP.NET_SessionId) et les éventuels messages d'erreur
        return new Promise((resolve, reject) => {
            (async() => {
                try {
                    const browser = await this.puppeteer.launch({ headless: true });
                    const page = await browser.newPage();
                    await page.goto('https://www.e-lyco.fr/');
                    await page.waitForTimeout(1000);
                    await page.$eval('.menu > li > a', el => el.click());
                    await page.waitForTimeout(1000);
                    await page.$eval('.champ', el => el.click());
                    await page.$eval('#valider', el => el.click());
                    await page.waitForTimeout(1000);
                    await page.waitForSelector('#bouton_eleve', { visible: true });
                    await page.$eval('#bouton_eleve', el => el.click());
                    await page.$eval('#username', (el, username) => el.value = username, username);
                    await page.$eval('#password', (el, password) => el.value = password, password);
                    await page.click('#bouton_valider');
                    await page.waitForTimeout(2000);
                    if (await page.url() == 'https://educonnect.education.gouv.fr/idp/profile/SAML2/Redirect/SSO?execution=e1s2') {
                        //les identifiants sont incorrects
                        reject({
                            status: false,
                            message: 'Identifiants incorrects'
                        });
                    } else {
                        //les identifiants sont corrects
                        try {
                            let cookie = await page.cookies();
                            let sessionId = cookie.find(c => c.name == 'ASP.NET_SessionId').value;
                            resolve({
                                status: true,
                                message: 'Connexion réussie',
                                sessionId: sessionId
                            });
                        } catch (err) {
                            reject({
                                status: false,
                                message: 'Une erreur est survenue'
                            });
                        }

                    }
                    await browser.close();
                } catch (err) {
                    console.error('[CREATOR LAB] Erreur de scraping', err);
                    reject({
                        status: false,
                        message: 'Une erreur est survenue'
                    });

                }
            })();
        });
    }
    getUserByUsername(username) {
        //retourne une promise contenant l'utilisateur correspondant à l'username
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, rows) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    updateUserSessionIdByUsername(username, sessionId) {
        //met à jour l'utilisateur correspondant à l'username avec le sessionId et renvoie une promise contenant le token généré pour l'utilisateur
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE users SET clientId = '${sessionId}' WHERE username = '${username}'`, (err, rows) => {
                if (err) {
                    reject({
                        status: false,
                        message: 'Une erreur est survenue'
                    });
                } else {
                    this.db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, rows) => {
                        if (err) {
                            reject({
                                status: false,
                                message: 'Une erreur est survenue'
                            });
                        } else {
                            resolve({
                                status: true,
                                message: 'SessionId mis à jour avec succès',
                                token: rows[0].token
                            });
                        }
                    });
                }
            });
        });
    }
    getSessionId(token) {
        //retourne une promise contenant le sessionId de l'utilisateur correspondant au token
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT clientId FROM users WHERE token = '${token}'`, (err, rows) => {
                if (err) {
                    reject({
                        status: false,
                        message: 'Une erreur est survenue'
                    });
                } else {
                    if (rows.length == 0) {
                        this.getSessionIdReturn = {
                            status: false,
                            message: 'Utilisateur non trouvé'
                        }
                    } else {
                        this.getSessionIdReturn = {
                            status: true,
                            message: 'SessionId trouvé',
                            sessionId: rows[0].clientId
                        }
                    }
                    resolve(this.getSessionIdReturn);
                }
            })
        });
    }
    async checkSessionId(sessionId) {
        let response = await this.fetch('https://elyco.itslearning.com/DashboardMenu.aspx', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                try {
                    let name = body.match(/<span class='h-va-middle h-is-not-mobile'>([^<]+)/gm)[0].replace(/<span class='h-va-middle h-is-not-mobile'>/, '');
                    let avatar = body.match(/https:\/\/filerepository.itslearning.com\/([^"]+)/gm)[2];
                    if (name && avatar && name != "" && avatar != "") {
                        this.checkSessionIdReturn = {
                            status: true,
                            message: 'Session valide',
                            name: name,
                            avatar: avatar
                        }
                    } else {
                        this.checkSessionIdReturn = {
                            status: false,
                            message: 'Session invalide'
                        }
                    }
                    return this.checkSessionIdReturn;
                } catch (err) {
                    console.error('[CREATOR LAB] Erreur de scraping', err);
                    this.checkSessionIdReturn = {
                        status: false,
                        message: 'Session invalide'
                    }
                    return this.checkSessionIdReturn;
                }

            })
            .catch(err => {
                console.log('[CREATOR LAB] Erreur de connexion', err);
                return {
                    status: false,
                    message: 'Erreur de connexion'
                }
            });
        return response
    }
    updateNameAndAvatar(token, name, avatar) {
        //met à jour le nom et l'avatar de l'utilisateur correspondant au token dans la base de données
        //retourne true si la requete SQL réussit, false sinon
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE users SET name = '${name}', avatar = '${avatar}' WHERE token = '${token}'`, (err, rows) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    updateSocketId(token, socketId) {
        //met à jour l'utilisateur correspondant au token avec le socketId et renvoie une promise
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE users SET socketId = '${socketId}' WHERE token = '${token}'`, (err, rows) => {
                if (err) {
                    reject({
                        status: false,
                        message: 'Une erreur est survenue'
                    });
                } else {
                    resolve({
                        status: true,
                        message: 'SocketId mis à jour avec succès'
                    });
                }
            });
        });
    }
    async updateAntiforgeryToken(token) {
        //récupérer le sessionId dans la base de données
        let returnData = await this.getSessionId(token);
        if (returnData.status) {
            //effectué un fetch pour récupérer le token antiforgery
            let returnDataAntiforgery = await this.fetch('https://elyco.itslearning.com/DashboardMenu.aspx', {
                    method: 'GET',
                    headers: {
                        'Cookie': `ASP.NET_SessionId=${returnData.sessionId}`
                    }
                })
                .then(res => res.text())
                .then(body => {
                    let antiforgeryToken = body.match(/({"antiForgeryHeaderName":"__ITSL_ANTIFORGERY_TOKEN__","antiForgeryHeaderValue":".[^"]+)/gm)[0].replace(/({"antiForgeryHeaderName":"__ITSL_ANTIFORGERY_TOKEN__","antiForgeryHeaderValue":")/g, '')
                    return {
                        status: true,
                        message: 'Token antiforgery récupéré',
                        antiforgeryToken: antiforgeryToken
                    };
                })
                .catch(err => {
                    console.log('[CREATOR LAB] Erreur de scraping', err);
                    return {
                        status: false,
                        message: 'Erreur de connexion à Elyco'
                    }
                });
            if (returnDataAntiforgery.status) {
                //met à jour le token antiforgery dans la base de données
                return new Promise((resolve, reject) => {
                    this.db.query(`UPDATE users SET antiforgery_token = '${returnDataAntiforgery.antiforgeryToken}' WHERE token = '${token}'`, (err, rows) => {
                        if (err) {
                            reject({
                                status: false,
                                message: 'Une erreur est survenue'
                            });
                        } else {
                            resolve({
                                status: true,
                                message: 'Token antiforgery mis à jour avec succès'
                            });
                        }
                    });
                });
            } else {
                return {
                    status: false,
                    message: 'Erreur de connexion à Elyco'
                }
            }
        } else {
            return {
                status: false,
                message: 'Token invalide'
            }
        }
    }
    async checkCoursesAccess(sessionId) {
        //tenter de récupérer les cours
        let response = await this.fetch('https://elyco.itslearning.com/Course/AllCourses.aspx', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                if (body.toString().indexOf('Accès refusé') > -1) {
                    return {
                        status: false,
                        message: 'Accès refusé'
                    }
                } else {
                    return {
                        status: true,
                        message: 'Cours récupérés'
                    };
                }
            })
            .catch(err => {
                return {
                    status: false,
                    message: err
                };
            });
        return response;
    }

    connectToPronote(sessionId) {
        return {
            status: false,
            message: 'Pas encore implémenté'
        }
    }
}

module.exports = Login;