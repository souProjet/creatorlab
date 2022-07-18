let User = class User {
    constructor(puppeteer, clusterObject, fetch, fs) {
        this.puppeteer = puppeteer;
        this.clusterObject = clusterObject;
        this.fs = fs;
        this.fetch = fetch;
        this.cluster;
        this.returnData = {
            status: false,
            message: '',
        };
        this.userInfo = {
            status: false
        }
    }
    async initCluster() {
        this.cluster = await this.clusterObject.launch({
            concurrency: this.clusterObject.CONCURRENCY_CONTEXT,
            maxConcurrency: 4,
            monitor: false, //true
            puppeteerOptions: {
                headless: true,
                ignoreHTTPSErrors: true,
                args: [
                    '--window-size=1920,1080',
                    '--no-sandbox',
                ],
                defaultViewport: {
                    width: 1920,
                    height: 1080
                }
            }
        });
        this.cluster.on('taskerror', (err, data, willRetry) => {
            if (willRetry) console.warn(`Erreur de scraping, réessai prévu : `);
            //traitement de l'erreur
            else console.error(`Erreur de scraping :`);
            console.log(err);

        });
    }
    async verifyLogin() {
        await this.cluster.task(async({ page, data: data }) => {
            await page.goto('https://www.e-lyco.fr/');
            await page.waitForTimeout(1000);
            await page.$eval('.menu > li > a', el => el.click());
            await page.waitForTimeout(1000);
            await page.$eval('.champ', el => el.click());
            await page.$eval('#valider', el => el.click());
            await page.waitForTimeout(1000);
            await page.waitForSelector('#bouton_eleve', { visible: true });
            await page.$eval('#bouton_eleve', el => el.click());
            await page.$eval('#username', (el, username) => el.value = username, data.username);
            await page.$eval('#password', (el, password) => el.value = password, data.password);
            await page.click('#bouton_valider');
            await page.waitForTimeout(2000);
            if (await page.url() == 'https://educonnect.education.gouv.fr/idp/profile/SAML2/Redirect/SSO?execution=e1s2') {
                this.returnData.status = false;
                this.returnData.message = 'Identifiants invalides';
            } else {
                await page.waitForTimeout(2000);
                let sessionCookie = '';
                let cookies = await page.cookies()
                for (let i = 0; i < cookies.length; i++) {
                    if (cookies[i].name == 'ASP.NET_SessionId') {
                        sessionCookie = cookies[i].value;
                    }
                }

                let antiforgeryToken = await this.fetch('https://elyco.itslearning.com/DashboardMenu.aspx', {
                        method: 'GET',
                        headers: {
                            'Cookie': `ASP.NET_SessionId=${sessionCookie}`
                        }
                    })
                    .then(res => res.text())
                    .then(body => {
                        let antiforgeryToken = body.match(/({"antiForgeryHeaderName":"__ITSL_ANTIFORGERY_TOKEN__","antiForgeryHeaderValue":".[^"]+)/gm)[0].replace(/({"antiForgeryHeaderName":"__ITSL_ANTIFORGERY_TOKEN__","antiForgeryHeaderValue":")/g, '')
                        return antiforgeryToken;
                    })
                    .catch(err => {
                        console.log(err);
                    });

                await page.goto('https://servicesexternes.itslfr-aws.com/Default.cshtml?itsl_auth=%7b%22TermId%22%3anull%2c%22TermSyncKey%22%3anull%2c%22CourseId%22%3anull%2c%22CourseSyncKey%22%3anull%2c%22LaunchUrl%22%3a%22https%3a%2f%2fservicesexternes.itslfr-aws.com%2fDefault.cshtml%22%2c%22TimeStamp%22%3a%222022-07-15T13%3a48%3a36%22%2c%22PostTo%22%3a%22%22%2c%22CustomerId%22%3a%22200026%22%2c%22PersonId%22%3a%22455511%22%2c%22Language%22%3a%22fr-FR%22%2c%22Country%22%3a%22FR%22%2c%22EducationalLevel%22%3a%22Secondary%22%2c%22Role%22%3a%22Learner%22%2c%22EditReference%22%3anull%2c%22Prefix%22%3a%22%22%2c%22FirstName%22%3a%22Swann%22%2c%22LastName%22%3a%22BOUGOUIN%22%2c%22OAuthToken%22%3a%22af1bfd2f-97c0-4752-835e-80010d9ed644%22%2c%22OAuthTokenSecret%22%3a%22645173cf-8aa2-42f1-96a4-9929f3c80c39%22%2c%22ItslearningSection%22%3a%22TopMenu%22%7d&itsl_sign=ad7fad4845d3ea180b2c69d6f1c142d3');
                await page.waitForTimeout(1000);
                await page.evaluate(() => {
                    document.querySelector('li:nth-child(2)').setAttribute('onclick', document.querySelector('li:nth-child(2)').getAttribute('onclick').replace('window.open', 'document.location=').replace('(', '').replace(')', ''))
                })
                await page.$eval('li:nth-child(2)', el => el.click());
                await page.waitForTimeout(5000);
                await page.evaluate(() => {
                    document.querySelectorAll('.menu-principal_niveau1')[3].querySelector('li').click();
                });
                await page.waitForTimeout(2000);
                let schedule = await page.evaluate(() => {
                    let timeTemplate = ['08h05', '08h30', '09h00', '9h30', '10h15', '10h45', '11h10', '11h40', '12h05', '12h30', '13h00', '13h30', '13h55', '14h25', '14h50', '15h20', '16h05', '16h35', '17h00', '17h30', '17h55'];
                    let dayTemplate = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
                    let scheduleDom = document.createElement('div');
                    scheduleDom.innerHTML = document.getElementById(`GInterface.Instances[2].Instances[1].Instances[0]_Grille_Elements`).innerHTML.replace("id=\"id_125_cours_0\"", "id=\"id_125_cours_0 \" sh=\"" + (document.querySelector('#id_122_Grille_').style.height) + "\" sw=\"" + (document.querySelector('#id_122_Grille_').style.width) + "\"");
                    let scheduleJSON = [];
                    let courseDom = scheduleDom.querySelectorAll('.EmploiDuTemps_Element');
                    let scheduleHeight = parseInt(scheduleDom.querySelector('.EmploiDuTemps_Element').getAttribute('sh').replace('px', ''));
                    let scheduleWidth = parseInt(scheduleDom.querySelector('.EmploiDuTemps_Element').getAttribute('sw').replace('px', ''));
                    for (let i = 0; i < courseDom.length; i++) {
                        let course = courseDom[i].outerHTML;
                        let courseDOM = document.createElement('div');
                        courseDOM.innerHTML = course;
                        courseDOM = courseDOM.firstChild;
                        let courseLeft = parseInt(courseDOM.style.left.replace('px', ''));
                        let courseTop = parseInt(courseDOM.style.top.replace('px', ''));
                        // let courseWidth = parseInt(courseDOM.style.width.replace('px', ''));
                        let courseHeight = parseInt(courseDOM.style.height.replace('px', ''));
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
                            teacher: courseDOM.querySelector('.AlignementMilieu:nth-child(2)').innerHTML,
                            subject: courseDOM.querySelector('.AlignementMilieu:nth-child(1)').innerHTML,
                            room: courseDOM.querySelector('.AlignementMilieu:nth-child(3)').innerHTML,
                            event: courseDOM.querySelectorAll('tr').length == 2 ? courseDOM.querySelectorAll('tr')[0].querySelector('.NoWrap.ie-ellipsis').innerHTML : false
                        };
                        scheduleJSON.push(courseJSON);
                    }
                    return scheduleJSON;
                });
                await page.evaluate(() => {
                    document.querySelectorAll('.label-menu_niveau0')[2].click();
                });
                await page.waitForTimeout(2000);
                let reportcard = await page.evaluate(() => {
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
                });
                this.returnData.schedule = schedule;
                this.returnData.reportcard = reportcard;
                this.returnData.cookie = sessionCookie;
                this.returnData.antiforgeryToken = antiforgeryToken;
                this.returnData.status = true;
                this.returnData.message = 'Identification réussite';
            }

        });
    }
    login(username, password) {
        return new Promise(resolve => {
            this.initCluster().then(async() => {
                await this.verifyLogin();
                this.cluster.queue({ username: username, password: password })
                await this.cluster.idle();
                await this.cluster.close();
            }).then(() => {
                resolve(this.returnData);
            });
        });
    }
    async getUserInfo(clientId) {
        let response = await this.fetch('https://elyco.itslearning.com/instantmessage/instantmessage', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                if (body.includes('401 - Unauthorized: Access is denied due to invalid credentials.')) {
                    this.userInfo.status = false;
                } else {
                    let personalInfo = body.toString().split('params')[1].split("\">")[0].replace(":", "").trim().slice(0, -1);
                    let username = personalInfo.split(":")[3].split('profile')[0].trim().slice(0, -1).replaceAll('\'', '');
                    let avatar = "https:" + personalInfo.split(":")[5].split(',')[0].replaceAll('\'', '');
                    this.userInfo.status = true;
                    this.userInfo.content = { username: username, avatar: avatar };
                }
                return this.userInfo;

            })
            .catch(err => {
                console.log(err);
            });
        return response;
    }
    updateSchedule(token, scheduleJSON) {
        this.fs.writeFileSync('./userdata/' + token + '/schedule.json', JSON.stringify(scheduleJSON));
    }
    updateReportcard(token, reportcardJSON) {
        this.fs.writeFileSync('./userdata/' + token + '/reportcard.json', JSON.stringify(reportcardJSON));
    }
}

let Bdd = class Bdd {
    constructor(bd) {
        this.bd = bd;
    }
    async addUser(username, clientId, antiforgeryToken) {
        return new Promise(async resolve => {
            let token = this.generateToken();
            this.bd.query(`INSERT INTO users (private_key, token, username, avatar, clientId, name, socketid, antiforgery_token) VALUES ('${this.generateToken()}', '${token}','${username}','', '${clientId}', '', '', '${antiforgeryToken}')`, (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(token);
                }
            });
        });

    }
    getUserByUsername(username) {
        return new Promise(async resolve => {
            this.bd.query(`SELECT * FROM users WHERE username = '${username}'`, (err, rows) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getUserBySocketId(socketId) {
        return new Promise(async resolve => {
            this.bd.query(`SELECT * FROM users WHERE socketid = '${socketId}'`, (err, rows) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getUser(token) {
        return new Promise(async resolve => {
            this.bd.query(`SELECT * FROM users WHERE token = '${token}'`, (err, rows) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getUserByPrivateKey(privateKey) {
        return new Promise(async resolve => {
            this.bd.query(`SELECT * FROM users WHERE private_key = '${privateKey}'`, (err, rows) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    updateUser(token, name, avatar, socketId) {
        this.bd.query(`UPDATE users SET name = '${name}', avatar = '${avatar}', socketid = '${socketId}' WHERE token = '${token}'`);
    }
    updateClientIdUserByUsername(username, newClientId) {
        this.bd.query(`UPDATE users SET clientId = '${newClientId}' WHERE username = '${username}'`);
    }
    updateClientIdUser(token, newClientId) {
        this.bd.query(`UPDATE users SET clientId = '${newClientId}' WHERE token = '${token}'`);
    }
    updateAntiforgeryTokenUserByUsername(username, newAntiForgeryToken) {
        this.bd.query(`UPDATE users SET antiforgery_token = '${newAntiForgeryToken}' WHERE username = '${username}'`);
    }
    updateAntiForgeryTokenUser(token, newAntiForgeryToken) {
        this.bd.query(`UPDATE users SET antiforgery_token = '${newAntiForgeryToken}' WHERE token = '${token}'`);
    }
    removeSocketIdUser(socketId) {
        this.bd.query(`UPDATE users SET socketid = '' WHERE socketid = '${socketId}'`);
    }
    setSocketIdUser(token, socketId) {
        this.bd.query(`UPDATE users SET socketid = '${socketId}' WHERE token = '${token}'`);
    }
    generateToken(length = 20) {
        let token = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    addPost(privateKey, content, attachement) {
        let date = new Date();
        let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        let postToken = this.generateToken(10);
        this.bd.query(`INSERT INTO posts (private_key, created, content, token) VALUES ('${privateKey}', '${dateString}', '${content}', '${postToken}')`);
        return postToken;
    }
    getPosts(privateKey) {
        return new Promise(async resolve => {
            this.bd.query(`SELECT * FROM posts WHERE private_key = '${privateKey}' ORDER BY id DESC LIMIT 10`, (err, rows) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    getUserInfoPosts(posts, privateKey) {
        return new Promise(async resolve => {
            let userInfo = [];
            for (let i = 0; i < posts.length; i++) {
                let user = await this.getUserByPrivateKey(posts[i].private_key);
                userInfo.push({
                    name: user[0].name,
                    avatar: user[0].avatar,
                    created: posts[i].created,
                    isYou: user[0].private_key === privateKey,
                });
                delete posts[i].private_key;
                posts[i].userInfo = userInfo[i];
            }
            resolve(posts);
        });
    }
    getLikeInfoPosts(posts, privateKey) {
        return new Promise(async resolve => {
            let likeInfo = [];
            for (let i = 0; i < posts.length; i++) {
                let likes = await this.getNbrLikePosts(posts[i].token);
                likeInfo.push({
                    nbrLikes: likes.length,
                    isLiked: likes.some(like => like.private_key === privateKey)
                });
                delete likeInfo[i].private_key;
                posts[i].likeInfo = likeInfo[i];

            }
            resolve(posts);
        });
    }
    getNbrLikePosts(postId) {
        return new Promise(async resolve => {
            this.bd.query(`SELECT * FROM likes WHERE post_id = '${postId}'`, (err, rows) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(rows);
                }
            });

        });
    }
    deletePost(postToken, privateKey) {
        this.bd.query(`DELETE FROM posts WHERE token = '${postToken}' AND private_key = '${privateKey}'`);
        this.bd.query(`DELETE FROM likes WHERE post_id = '${postToken}'`);
    }

    likePost(postToken, privateKey) {
        this.bd.query(`SELECT * FROM likes WHERE post_id = '${postToken}' AND private_key = '${privateKey}'`, (err, rows) => {
            if (err) {
                return false;
            } else {
                if (rows.length === 0) {
                    this.bd.query(`INSERT INTO likes (private_key, post_id) VALUES ('${privateKey}', '${postToken}')`);
                    return true;
                } else {
                    this.bd.query(`DELETE FROM likes WHERE post_id = '${postToken}' AND private_key = '${privateKey}'`);
                    return true;
                }
            }
        });
    }

}
let Users = class Users {
    constructor(fetch) {
        this.fetch = fetch;
    }
    async getProfile(clientId, id) {
        let response = await this.fetch(`https://elyco.itslearning.com/restapi/persons/relations/${id}`, {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.json())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });
        return response;

    }
}
module.exports = {
    User,
    Bdd,
    Users
};