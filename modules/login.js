let Login = class Login {
    constructor(db, fetch, fs, https, puppeteer) {
        this.db = db;
        this.fetch = fetch;
        this.fs = fs;
        this.https = https;
        this.puppeteer = puppeteer;
        this.checkSessionIdReturn = {
            status: false,
            message: 'Une erreur est survenue'
        }
        this.getSessionIdsReturn = {
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
                        message: 'Une erreur est survenue',
                        l: 33
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
    loginToEduconnect(counter, username, password) {
        // try {
        //     return new Promise((resolve, reject) => {
        //         let https = this.https;
        //         const req1 = https.request({
        //             hostname: 'cas3.e-lyco.fr',
        //             port: 443,
        //             path: '/Shibboleth.sso/Login?SAMLDS=1&entityID=https%3A%2F%2Feduconnect.education.gouv.fr%2Fidp',
        //             method: 'GET'
        //         }, async(res1) => {
        //             let location = res1.headers.location;
        //             const browser = await this.puppeteer.launch({ headless: true });
        //             const page = await browser.newPage();
        //             await page.goto(location);
        //             let educonnectCookies = await page.cookies();
        //             let JSESSIONID = educonnectCookies.find(c => c.name == 'JSESSIONID').value;
        //             await page.$eval('#username', (el, username) => el.value = username, username);
        //             await page.$eval('#password', (el, password) => el.value = password, password);
        //             await page.evaluate((ids) => {
        //                 document.querySelector('#username').value = ids.username;
        //                 document.querySelector('#password').value = ids.password;
        //                 document.querySelector('#bouton_valider').click();
        //             }, { "username": username, "password": password })
        //             await page.waitForTimeout(2000)
        //             if (await page.url().indexOf('educonnect.education.gouv.fr') != -1) {
        //                 //les identifiants sont incorrects
        //                 reject({
        //                     status: false,
        //                     message: 'Identifiants incorrects'
        //                 });
        //             } else {
        //                 let cookie = await page.cookies();
        //                 let shibsession = cookie.find(c => c.name.indexOf('_shibsession_') != -1)
        //                 shibsession = shibsession.name + '=' + shibsession.value;
        //                 console.log(JSESSIONID)

        //                 await page.goto('https://elyco.itslearning.com/DashboardMenu.aspx');
        //                 await page.waitForTimeout(2000)
        //                 console.log(await page.cookies())
        //                 // const req2 = https.request({
        //                 //     hostname: 'elyco.itslearning.com',
        //                 //     port: 443,
        //                 //     path: '/DashboardMenu.aspx',
        //                 //     method: 'GET'
        //                 // }, (res2) => {
        //                 //     let sessionId = res2.headers['set-cookie'].find(c => c.indexOf('ASP.NET_SessionId=') != -1).split('ASP.NET_SessionId=')[1].split(';')[0]
        //                 //         //if (res2.status == 200) {
        //                 //     console.log(sessionId);
        //                 //     console.log(shibsession)
        //                 //     resolve({
        //                 //         status: true,
        //                 //         message: 'Connexion réussie',
        //                 //         sessionId: sessionId,
        //                 //         shibsession: shibsession
        //                 //     });
        //                 //     // } else {
        //                 //     //     resolve({
        //                 //     //         status: false,
        //                 //     //         message: 'Une erreur est survenue'
        //                 //     //     })
        //                 //     // }

        //                 // })
        //                 // req2.on('error', (e) => {
        //                 //     console.error(e);
        //                 // });
        //                 // req2.end();

        //             }
        //             await page.screenshot({ path: 'screenshot.png' });
        //             browser.close();

        //         });

        //         req1.on('error', (e) => {
        //             console.error(e);
        //         });
        //         req1.end();
        //     });
        // } catch (err) {
        //     //console.error('[CREATOR LAB] Erreur de scraping', err);
        //     return {
        //         status: false,
        //         message: 'Une erreur est survenue'
        //     };
        // }
        //try {

        return new Promise(async(resolve, reject) => {
                const browser = await this.puppeteer.launch({ headless: true });
                const page = await browser.newPage();

                await page.goto('https://elyco.itslearning.com/elogin/autologin.aspx');
                await page.waitForTimeout(1500);
                await page.evaluate(() => {
                    document.querySelector('.champ').click();
                    setTimeout(document.querySelector('#valider').click(), 500);
                })
                await page.waitForTimeout(1500);
                await page.evaluate((ids) => {
                    document.querySelector('#username').value = ids.username;
                    document.querySelector('#password').value = ids.password;
                    document.querySelector('#bouton_valider').click();
                }, { "username": username, "password": password });
                await page.waitForTimeout(2500);
                let pageUrl = await page.url();
                if (pageUrl.indexOf('educonnect.education.gouv.fr') != -1) {
                    //les identifiants sont incorrects
                    reject({
                        status: false,
                        message: 'Identifiants incorrects'
                    });
                } else {
                    let cookie = await page.cookies();
                    let sessionId = cookie.find(c => c.name == 'ASP.NET_SessionId').value;
                    await page.goto('https://cas3.e-lyco.fr');
                    let cas3Cookies = await page.cookies();
                    let shibsession = cas3Cookies.find(c => c.name.indexOf('_shibsession_') != -1)
                    shibsession = shibsession.name + '=' + shibsession.value;
                    resolve({
                        status: true,
                        message: 'Connexion réussie',
                        sessionId: sessionId,
                        shibsession: shibsession
                    });
                }
                browser.close();
            }).catch(e => {
                reject({
                    status: false,
                    message: 'Une erreur est survenue'
                })
            })
            // } catch (err) {
            //     //console.error('[CREATOR LAB] Erreur de scraping', err);
            //     return {
            //         status: false,
            //         message: 'Une erreur est survenue'
            //     };
            // }
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
                        message: 'Une erreur est survenue',
                        l: 119
                    });
                } else {
                    this.db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, rows) => {
                        if (err) {
                            reject({
                                status: false,
                                message: 'Une erreur est survenue',
                                l: 127
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

    updateShibsessionByUsername(username, shibsession) {
        //met à jour l'utilisateur correspondant à l'username avec le shibsession et renvoie une promise contenant les logs de connexion
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE users SET shibsession = '${shibsession}' WHERE username = '${username}'`, (err, rows) => {
                if (err) {
                    console.log(err)
                    reject({
                        status: false,
                        message: 'Une erreur est survenue',
                        l: 150
                    });
                } else {
                    resolve({
                        status: true,
                        message: 'Shibsession mis à jour avec succès'
                    });
                }
            });
        });
    }
    getSessionIds(token) {
        //retourne une promise contenant le sessionId de l'utilisateur correspondant au token
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE token = '${token}'`, (err, rows) => {
                if (err) {
                    reject({
                        status: false,
                        message: 'Une erreur est survenue',
                        l: 169
                    });
                } else {
                    if (rows.length == 0) {
                        this.getSessionIdsReturn = {
                            status: false,
                            message: 'Utilisateur non trouvé'
                        }
                    } else {
                        this.getSessionIdsReturn = {
                            status: true,
                            message: 'SessionId trouvé',
                            sessionId: rows[0].clientId,
                            shibsession: rows[0].shibsession,
                            antiforgeryToken: rows[0].antiforgery_token
                        }
                    }
                    resolve(this.getSessionIdsReturn);
                }
            })
        });
    }
    checkSessionId(sessionId) {
        return new Promise((resolve, reject) => {
            this.fetch('https://elyco.itslearning.com/DashboardMenu.aspx', {
                    method: 'GET',
                    headers: {
                        'Cookie': `ASP.NET_SessionId=${sessionId}`
                    }
                })
                .then(res => res.text())
                .then(body => {
                    let name = body.match(/<span class='h-va-middle h-is-not-mobile'>([^<]+)/gm)[0].replace(/<span class='h-va-middle h-is-not-mobile'>/, '');
                    let avatar = body.match(/https:\/\/filerepository.itslearning.com\/([^"]+)/gm)[2];
                    if (name && avatar && name != "" && avatar != "") {
                        resolve({
                            status: true,
                            message: 'Session valide',
                            name: name,
                            avatar: avatar
                        })
                    } else {
                        reject({
                            status: false,
                            message: 'Session invalide'
                        })
                    }
                }).catch(err => {
                    console.log('[CREATOR LAB] Erreur de connexion', err);
                    reject({
                        status: false,
                        message: 'Erreur de connexion'
                    })
                });
        })
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
                        message: 'Une erreur est survenue',
                        l: 257
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
        let returnData = await this.getSessionIds(token);
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
                                message: 'Une erreur est survenue',
                                l: 303
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

    async connectToPronote(page, shibsession) {
        try {
            await page.goto('https://cas3.e-lyco.fr');
            //inject shibsession cookie

            await page.setCookie({
                name: shibsession.split('=')[0],
                value: shibsession.split('=')[1],
                domain: 'cas3.e-lyco.fr',
                path: '/',
            });
            // await page.reload();
            await page.goto('https://pronote.lyc-orbigny-44.ac-nantes.fr/pronote/eleve.html');
            await page.waitForTimeout(4000);
            await page.evaluate(() => {
                document.querySelectorAll('.menu-principal_niveau1')[6].querySelector('li').click();
            });
            await page.waitForTimeout(4000);

        } catch (err) {
            return {
                status: false,
                message: "erreur lors de la connexion à Pronote"
            }
        }
        //#############################################################################################################################
        //                                          RÉCUPÉRATION DE L'EMPLOIS DU TEMPS  
        //#############################################################################################################################
        let schedule = '';
        let reportcard = '';
        try {
            schedule = await page.evaluate(() => {
                let timeTemplate = ['08h05', '08h30', '09h00', '9h30', '10h15', '10h45', '11h10', '11h40', '12h05', '12h30', '13h00', '13h30', '13h55', '14h25', '14h50', '15h20', '16h05', '16h35', '17h00', '17h30', '17h55'];
                let dayTemplate = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
                let scheduleDom = document.createElement('div');
                scheduleDom.innerHTML = document.querySelector('.corpsGrille').children[1].firstChild.firstChild.innerHTML.replace("id=\"id_125_cours_0\"", "id=\"id_125_cours_0 \" sh=\"" + (document.querySelector('#id_122_Grille_').style.height) + "\" sw=\"" + (document.querySelector('#id_122_Grille_').style.width) + "\"");
                let scheduleJSON = [];

                let courseDom = scheduleDom.querySelectorAll('.EmploiDuTemps_Element');
                let scheduleHeight = parseInt(scheduleDom.querySelector('.EmploiDuTemps_Element').getAttribute('sh').replace('px', ''));
                let scheduleWidth = parseInt(scheduleDom.querySelector('.EmploiDuTemps_Element').getAttribute('sw').replace('px', ''));
                for (let i = 0; i < courseDom.length; i++) {
                    //let course = courseDom[i].outerHTML;
                    let courseDOM = document.createElement('div');
                    courseDOM.innerHTML = courseDom[i].outerHTML;
                    courseDOM = courseDOM.firstChild;
                    let courseLeft = parseInt(courseDOM.style.left.replace('px', '').trim())
                    let courseTop = parseInt(courseDOM.style.top.replace('px', '').trim());
                    //let courseWidth = courseDOM.style.width.replace('px', '');

                    let courseHeight = parseInt(courseDOM.style.height.replace('px', '').trim())
                    let col = Math.ceil(courseLeft / (scheduleWidth / 5)) + 1;
                    let row = Math.round((courseTop / (scheduleHeight / 10) + 1) * -10) / -10;
                    let height = Math.round((courseHeight / (scheduleHeight / 10)) * -10) / -10;
                    let startingTime = dayTemplate[col - 1] + ' ' + timeTemplate[(row - 1) * 2];
                    let endingTime = dayTemplate[col - 1] + ' ' + timeTemplate[(row - 1 + height) * 2];
                    let courseJSON = {
                        col: col,
                        row: row,
                        height: height,
                        startingTime: startingTime,
                        endingTime: endingTime,
                        room: courseDOM.querySelectorAll('.AlignementMilieu')[2] ? courseDOM.querySelectorAll('.AlignementMilieu')[courseDOM.querySelectorAll('.AlignementMilieu').length - 1].innerHTML : '',
                        teacher: courseDOM.querySelectorAll('.AlignementMilieu')[1] ? courseDOM.querySelectorAll('.AlignementMilieu')[1].innerHTML : '',
                        subject: courseDOM.querySelectorAll('.AlignementMilieu')[0] ? courseDOM.querySelectorAll('.AlignementMilieu')[0].innerHTML : '',
                        event: (courseDOM.querySelectorAll('tr').length == 2 ? (courseDOM.querySelectorAll('tr')[0].querySelector('.NoWrap.ie-ellipsis') ? courseDOM.querySelectorAll('tr')[0].querySelector('.NoWrap.ie-ellipsis').innerHTML : false) : false)
                    }
                    scheduleJSON.push(courseJSON);
                }
                return scheduleJSON;
            });
        } catch (err) {
            console.log(err)
            return {
                status: false,
                message: 'Erreur de récupération de l\'emploi du temps'
            }
        }

        await page.evaluate(() => {
            document.querySelectorAll('.menu-principal_niveau1')[3].querySelector('li').click();
        });
        await page.waitForTimeout(2000);


        //#############################################################################################################################
        //                                          RÉCUPÉRATION DU BULLETIN DE NOTES
        //#############################################################################################################################
        try {
            reportcard = await page.evaluate(() => {
                if (document.querySelector('.message-conteneur > span')) {
                    return {};
                } else {
                    let reportcardDom = document.createElement('div');
                    reportcardDom.innerHTML = document.querySelector('.EspaceGauche.EspaceHaut tr').innerHTML;
                    let reportcardJSON = {
                        general_student: parseFloat(reportcardDom.querySelector('.AlignementDroit.EspaceHaut div span span').innerHTML.trim().replace(',', '.')),
                        general_class: parseFloat(reportcardDom.querySelector('.AlignementDroit.EspaceHaut div:nth-child(2) span span').innerHTML.trim().replace(',', '.')),
                    };

                    let testContainerChildren = Array.from(document.querySelector('.SansMain.liste_fixed').childNodes);
                    let testMatters = [];
                    for (let i = 0; i < testContainerChildren.length; i++) {
                        if (testContainerChildren[i].querySelector('.Gras.Espace')) {
                            let evaluation = [];
                            for (let j = i + 1; j < testContainerChildren.length; j++) {
                                if (testContainerChildren[j].querySelector('.Gras.Espace')) {
                                    break;
                                } else if (testContainerChildren[j].querySelector('.Espace:not(.Gras)')) {
                                    evaluation.push({
                                        date: testContainerChildren[j].querySelector('.Espace:not(.Gras) div:nth-child(2)').innerHTML,
                                        class: parseFloat(testContainerChildren[j].querySelector('.Espace:not(.Gras) div:nth-child(3)').innerHTML.split(':')[1].trim().replace(',', '.')),
                                        student: parseFloat(testContainerChildren[j].querySelector('.Espace:not(.Gras) div:nth-child(1) div').innerHTML.trim().replace(',', '.')),
                                        of: testContainerChildren[j].querySelector('.Espace:not(.Gras) div:nth-child(1) div span') ? parseFloat(testContainerChildren[j].querySelector('.Espace:not(.Gras) div:nth-child(1) div span').innerHTML.replace('/', '')) : 20
                                    });
                                }
                            }

                            testMatters.push({
                                name: testContainerChildren[i].querySelector('.Gras.Espace div:nth-child(2)').innerHTML,
                                mean: parseFloat(testContainerChildren[i].querySelector('.Gras.Espace div:nth-child(1)').innerHTML.replace(',', '.').trim()),
                                evaluation: evaluation
                            });
                        }
                    }
                    reportcardJSON["matters"] = testMatters;
                    return reportcardJSON;
                }
            });
        } catch (err) {
            //console.log(err);
            return {
                status: false,
                message: "Erreur de récupération du bulletin de notes"
            }
        }

        return {
            status: true,
            message: 'Connecté à Pronote',
            schedule: schedule,
            reportcard: reportcard
        }
    }
}

module.exports = Login;