const express = require('express');
const fileupload = require('express-fileupload');
const mysql = require('mysql');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const config = require('./utils/config.json')
const fetch = require('node-fetch')
const fs = require('fs');
const utf8 = require('utf8');

const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database

});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/asset'));

//Importer les modules
const { User, Bdd, Users } = require('./modules/users.js');
const { Notif, Message, Courses } = require('./modules/utils.js');
const { Infos } = require('./modules/automations.js');
const Cloud = require('./modules/cloud.js');

//Instancier les modules
const user = new User(puppeteer, Cluster, fetch, fs);
const users = new Users(fetch);
const bdd = new Bdd(db);
const notif = new Notif(fetch);
const message = new Message(fetch);
const courses = new Courses(fetch);
const infos = new Infos(fetch, io, bdd);
const cloud = new Cloud(fs, utf8)

//fonctions outils 
function escapeHTML(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#x2F;');
}


//webSocket
io.on('connection', socket => {

    socket.on('joinRoom', async({ token }) => {
        //user.join(socket.id, username, clientId);
        //socket.emit('message', 'Bienvenu dans le jeu !');
        let userInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                userInfo = await user.getUserInfo(userInfoBdd[0].clientId);
                if (userInfoBdd[0].avatar == '' || userInfoBdd[0].name == '') {
                    bdd.updateUser(token, userInfo.content.username, userInfo.content.avatar, socket.id);
                }
                bdd.setSocketIdUser(token, socket.id);

                let nbrUnSeen = await infos.getUnSeen(userInfoBdd[0].clientId);
                if (nbrUnSeen) {
                    socket.emit('unseen', {
                        nbrUnSeenNotif: nbrUnSeen.notifs,
                        nbrUnSeenMessage: nbrUnSeen.messages
                    })
                }
            }
        } else {
            //y'a un bleme avec la requete
        }
        //les infos de l'utilisateur récupérées sur e-lyco
        socket.emit('userInfo', {
            status: userInfo.status,
            userInfo: userInfo.content
        });


    });
    //demande d'acquisition des notifications
    socket.on('getNotifs', async({ token }) => {
        let notifsInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let notifs = await notif.getNotif(userInfoBdd[0].clientId);
                if (notifs) {
                    let formatedNotifs = notif.format(notifs);
                    notifsInfo = {
                        status: true,
                        content: formatedNotifs
                    }
                }
            }
        } else {
            //y'a un bleme avec la requete
        }
        //envoyer les notifs trouvées
        socket.emit('notifs', {
            status: notifsInfo.status,
            notifs: notifsInfo.content
        })
    });
    //demande d'acquisition des messages
    socket.on('getMessages', async({ token, pageIndex }) => {
        let messagesInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let messages = await message.getMessage(userInfoBdd[0].clientId, pageIndex);
                if (messages) {
                    let formatedMessages = message.formatMessagePreview(messages);
                    messagesInfo = {
                        status: true,
                        content: formatedMessages
                    }
                }
            }
        } else {
            //y'a toujours un bleme avec la requete
        }
        //envoyer les messages trouvés
        socket.emit('messages', {
            status: messagesInfo.status,
            messages: messagesInfo.content
        })
    });

    //demande d'acquisition d'une conversation
    socket.on('getConv', async({ token, convId, pageIndex }) => {
        let convInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let conv = await message.getMessage(userInfoBdd[0].clientId, pageIndex);
                if (conv) {
                    let formatedConv = message.formatConv(conv, convId);
                    convInfo = {
                        status: true,
                        content: formatedConv
                    }
                }
            }
        } else {
            //y'a toujours un bleme avec la requete
        }
        //envoyer les messages trouvés
        socket.emit('conv', {
            status: convInfo.status,
            conv: convInfo.content
        })
    });

    //demande d'acquisition d'un profile
    socket.on('getProfile', async({ token, id, avatar, name }) => {
        let profileInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let profile = await users.getProfile(userInfoBdd[0].clientId, id);
                if (profile) {
                    profileInfo = {
                        status: true,
                        content: {
                            profile: profile,
                            avatar: avatar,
                            name: name
                        }
                    }
                }
            }
        } else {
            //y'a toujours un bleme avec la requete
        }
        //envoyer le profile trouvé
        socket.emit('profile', {
            status: profileInfo.status,
            profile: profileInfo.content,
        })
    });

    socket.on('sendMessage', async({ token, convId, text }) => {
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let sendMessage = await message.sendMessage(userInfoBdd[0].clientId, userInfoBdd[0]['antiforgery_token'], convId, escapeHTML(text));
                socket.emit('messageSent', {
                    status: sendMessage
                })

            }
        }
    });

    socket.on('getCourses', async({ token }) => {
        let coursesInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let coursesPreview = await courses.getCoursesPreview(userInfoBdd[0].clientId);
                if (coursesPreview) {
                    coursesPreview = courses.formatCoursesPreview(coursesPreview);
                    coursesInfo = {
                        status: true,
                        content: coursesPreview
                    }
                }
            }
        } else {
            //y'a toujours un bleme avec la requete
        }
        //envoyer les courses trouvées
        socket.emit('courses', {
            status: coursesInfo.status,
            courses: coursesInfo.content
        })
    });

    socket.on('viewCourse', async({ token, courseId }) => {
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let viewCourse = await courses.getCourses(userInfoBdd[0].clientId, courseId);
                if (viewCourse) {
                    viewCourse = courses.formatCourse(viewCourse);
                    socket.emit('coursedetails', {
                        status: true,
                        course: {
                            course: viewCourse,
                            courseId: courseId
                        }
                    })
                }
            }
        }
    });

    socket.on('getplandetails', async({ token, courseId, planId }) => {
        let planInfo = {
            status: false
        }
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                let plan = await courses.getPlanDetails(userInfoBdd[0].clientId, courseId, planId);
                if (plan) {
                    plan = courses.formatPlanDetails(plan, courseId, userInfoBdd[0].clientId);
                    planInfo = {
                        status: true,
                        content: plan
                    }
                }
            }
        } else {
            //y'a toujours un bleme avec la requete
        }
        //envoyer les plans trouvés
        socket.emit('plandetails', {
            status: planInfo.status,
            plan: planInfo.content,
            planId: planId,
            courseId: courseId
        })
    });

    socket.on('getdoc', async({ token, link }) => {
        let iframeLink = "";
        let userInfoBdd = await bdd.getUser(token);
        if (userInfoBdd) {
            if (userInfoBdd.length > 0) {
                iframeLink = await courses.getDoc(userInfoBdd[0].clientId, link);
            }
        }
        socket.emit('doc', {
            status: true,
            iframeLink: iframeLink
        })
    });

    socket.on('disconnect', () => {
        bdd.removeSocketIdUser(socket.id);
    });
});

//rooter
app.get('/', (req, res) => {
    //vérifier si l'utilisateur est connecté
    if (req.cookies.token) {
        res.sendFile(__dirname + '/template/accueil.html');
    } else {
        //utilisateur non connecté
        res.redirect('/login');
    }
});
app.get('/login', async(req, res) => {
    if (req.cookies.token) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/template/login.html');
    }
});

//API
app.post('/api/\*', async(req, res) => {
    let url = req.url.split('/')[2];
    let params = []
    for (let i = 2; i < req.url.split('/').length; i++) {
        params.push(req.url.split('/')[i]);
    }
    if (params.length > 1) {
        let method = params[1];
        if (params[0] == 'cloud') {
            let token = escapeHTML(req.body.token);
            let userInfoBdd = await bdd.getUser(token);
            if (userInfoBdd) {
                if (userInfoBdd.length == 1) {
                    switch (method) {
                        case 'getAllFiles':
                            let files = cloud.getAllFiles(token);
                            res.send(files);
                            break;
                        case 'createFolder':
                            let path = req.body.path ? escapeHTML(req.body.path) : null;
                            cloud.createFolder(token, path);
                            res.send({ success: true });
                            break;
                        case 'delete':
                            let id = req.body.id ? escapeHTML(req.body.id) : null;
                            let isFile = !!req.body.isFile;
                            let ext = req.body.ext ? escapeHTML(req.body.ext) : null;
                            let isUploadedFile = req.body.isUploadedFile ? JSON.parse(req.body.isUploadedFile) : null;
                            cloud.delete(token, id, isFile, isUploadedFile, ext);
                            res.send({ success: true });
                            break;
                        case 'rename':
                            let id2 = req.body.id ? escapeHTML(req.body.id) : null;
                            let newName = req.body.newName ? escapeHTML(req.body.newName) : null;
                            let isUploadedFile2 = req.body.isUploadedFile ? JSON.parse(req.body.isUploadedFile) : null;
                            let isFile2 = !!req.body.isFile;
                            if (newName) {
                                cloud.rename(token, id2, newName, isFile2, isUploadedFile2);
                                res.send({ success: true });
                            } else {
                                res.send({ success: false });
                            }
                            break;
                        case 'createFile':
                            let parentId = req.body.parentId ? escapeHTML(req.body.parentId) : null;
                            let fileId = cloud.createFile(token, parentId);
                            res.send({ success: true, fileId: fileId });
                            break;
                        case 'getFile':
                            let fileId2 = req.body.fileId ? escapeHTML(req.body.fileId) : null;
                            let ext2 = req.body.ext ? escapeHTML(req.body.ext) : null;
                            let isUploadedFile3 = req.body.isUploadedFile ? JSON.parse(req.body.isUploadedFile) : null;
                            let file = cloud.getFile(token, fileId2, isUploadedFile3, ext2);
                            res.send(file);
                            break;
                        case 'saveFile':
                            let fileId3 = req.body.fileId ? escapeHTML(req.body.fileId) : null;
                            let content = req.body.content
                            if (content) {
                                if (fileId3) {
                                    cloud.saveFile(token, fileId3, content);
                                    res.send({ success: true });
                                } else {
                                    res.send({ success: false });
                                }
                            }
                            break;
                        case 'upload':
                            let parentId2 = req.body.parentId ? escapeHTML(req.body.parentId) : null;
                            let filesUpload = req.files;
                            let nbrFiles = req.body.nbrFiles;

                            if (filesUpload) {
                                let success = true;
                                let error = '';
                                for (let i = 0; i < nbrFiles; i++) {
                                    let file = filesUpload["file" + i];
                                    file.name = utf8.decode(file.name);

                                    if (file.size < 100000000) {
                                        let returnState = cloud.upload(token, parentId2, file);
                                        success = returnState.success;
                                        error += (returnState.error != null ? returnState.error + "\n" : "");
                                    } else {
                                        success = false;
                                        error += "Sorry, 100Mo max pour " + file.name + "\n";
                                    }
                                }
                                res.send({ success: success, error: error });
                            } else {
                                res.send({ success: false, error: "Aucun fichier n'a été uploadé." });
                            }
                            break;

                    }
                } else {
                    res.send({ success: false });
                }
            } else {
                res.send({ success: false });
            }

        }
    } else {
        switch (url) {
            case 'login':
                //récupérer les infos et connecter l'utilisateur

                let usernameField = escapeHTML(req.body.username);
                let passwordField = escapeHTML(req.body.password);
                if (usernameField && passwordField && usernameField.length > 0 && passwordField.length > 0) {
                    const returnData = await user.login(usernameField, passwordField);
                    if (returnData.status) {
                        // res.cookie('clientId', returnData.cookie);
                        let userExist;
                        if (req.cookies.token) {
                            userExist = await bdd.getUser(req.cookies.token);
                        } else {
                            userExist = await bdd.getUserByUsername(usernameField);
                        }
                        if (userExist) {
                            if (userExist.length == 0) {
                                const token = await bdd.addUser(usernameField, returnData.cookie, returnData.antiforgeryToken);
                                user.updateSchedule(token, returnData.schedule);
                                user.updateReportcard(token, returnData.reportcard);
                                cloud.createUserDataProfile(token);
                                res.cookie('token', token);
                                res.send(returnData);
                            } else {
                                if (req.cookies.token) {
                                    bdd.updateClientIdUser(req.cookies.token, returnData.cookie);
                                    bdd.updateAntiforgeryTokenUser(req.cookies.token, returnData.antiforgeryToken);
                                } else {
                                    bdd.updateClientIdUserByUsername(usernameField, returnData.cookie);
                                    bdd.updateAntiforgeryTokenUserByUsername(usernameField, returnData.antiforgeryToken);
                                }
                                user.updateSchedule(userExist[0].token, returnData.schedule);
                                user.updateReportcard(userExist[0].token, returnData.reportcard);
                                res.cookie('token', userExist[0].token);

                                res.send(returnData);
                            }
                        }
                        delete returnData.cookie;

                    } else {
                        res.send(returnData);
                    }
                } else {
                    res.send({
                        status: false,
                        message: 'Veuillez remplir tous les champs'
                    });
                }
                break;
            case 'upload':
                let uploadDestination = escapeHTML(req.headers.destination);
                if (uploadDestination == 'elyco') {
                    //uploader un fichier sur elyco
                    let file = req.files.fileAttachment;
                    let fileName = file.name;
                    let fileSize = file.size;
                    let fileExtension = fileName.split('.').pop().toLowerCase();
                    let tokenSended = escapeHTML(req.headers.authorization.split(' ')[1]);
                    let userInfoBdd = await bdd.getUser(tokenSended);
                    if (userInfoBdd) {
                        if (userInfoBdd.length > 0) {
                            let acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'json', 'xml', 'txt', 'csv', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'mp3', 'mp4', 'ogg', 'wav', 'flac', 'aac', 'm4a', 'm4v', 'mov', 'wmv', 'avi', 'mpg', 'mpeg', '3gp', '3g2', 'mkv', 'webm', 'zip', 'rar', '7z', 'gz', 'tar', 'bz2', 'tgz', 'iso', 'dmg', 'exe', 'msi', 'bin', 'deb', 'rpm', 'cab', 'apk', 'ipa', 'app', 'exe', 'msi', 'bin', 'deb', 'rpm', 'cab', 'apk', 'ipa', 'app'];
                            if (acceptedExtensions.indexOf(fileExtension) > -1) {
                                if (fileSize < 10000000) {
                                    let antiforgeryToken = userInfoBdd[0]['antiforgery_token'];
                                    let fileInfo = await message.uploadFile(tokenSended, antiforgeryToken, file);
                                    res.send(fileInfo);
                                } else {
                                    res.send({
                                        status: false,
                                        message: 'Le fichier est trop volumineux'
                                    });
                                }
                            } else {
                                res.send({
                                    status: false,
                                    message: 'Le fichier n\'est pas un fichier valide'
                                });
                            }
                        }
                    }
                }
                break;

            case 'share':
                let token = escapeHTML(req.headers.authorization.split(' ')[1]);
                let userInfoBdd = await bdd.getUser(token);
                if (userInfoBdd) {
                    if (userInfoBdd.length > 0) {
                        let text = escapeHTML(req.body.text);
                        let images = req.files;
                        let nbrFiles = req.body.nbrFiles;
                        let imagesUpload = [];
                        if (text) {
                            for (let i = 0; i < nbrFiles; i++) {
                                let file = images["file" + i];
                                if (file.size < 20971520) {
                                    imagesUpload.push(file);
                                }
                            }
                            let postToken = bdd.addPost(userInfoBdd[0]['private_key'], escapeHTML(text), imagesUpload);
                            res.send({
                                status: true,
                                token: postToken
                            });

                        }
                    }
                }
                break;

            case 'deletepost':
                let token3 = escapeHTML(req.headers.authorization.split(' ')[1]);
                let userInfoBdd3 = await bdd.getUser(token3);
                if (userInfoBdd3) {
                    if (userInfoBdd3.length > 0) {
                        let postToken = escapeHTML(req.body.postToken);
                        if (postToken) {
                            bdd.deletePost(postToken, userInfoBdd3[0]['private_key']);
                            res.send({
                                status: true
                            });
                        }
                    }
                }
                break;

            case 'likepost':
                let token2 = escapeHTML(req.headers.authorization.split(' ')[1]);
                let userInfoBdd2 = await bdd.getUser(token2);
                if (userInfoBdd2) {
                    if (userInfoBdd2.length > 0) {
                        let postToken = escapeHTML(req.body.postToken);
                        if (postToken) {
                            bdd.likePost(postToken, userInfoBdd2[0]['private_key']);
                            res.send({
                                status: true
                            });
                        }
                    }
                }
                break;
        }
    }
});

app.get('/api/\*', async(req, res) => {
    let url = req.url.split('/')[2];
    let params = []
    for (let i = 2; i < req.url.split('/').length; i++) {
        params.push(req.url.split('/')[i]);
    }
    if (params.length > 1) {
        let method = params[1];
    } else {
        switch (url) {
            case 'getposts':
                let token2 = escapeHTML(req.headers.authorization.split(' ')[1]);
                let userInfoBdd2 = await bdd.getUser(token2);
                if (userInfoBdd2) {
                    if (userInfoBdd2.length > 0) {
                        let posts = await bdd.getPosts(userInfoBdd2[0]['private_key']);
                        posts = await bdd.getUserInfoPosts(posts, userInfoBdd2[0]['private_key']);
                        posts = await bdd.getLikeInfoPosts(posts, userInfoBdd2[0]['private_key']);
                        res.send({
                            status: true,
                            posts: posts
                        });
                    }
                }
                break;
            case 'getSchedule':
                let token3 = escapeHTML(req.headers.authorization.split(' ')[1]);
                let userInfoBdd3 = await bdd.getUser(token3);
                if (userInfoBdd3) {
                    if (userInfoBdd3.length > 0) {
                        let scheduleJSON = fs.readFileSync('./userdata/' + token3 + '/schedule.json', 'utf8');
                        res.send({
                            status: true,
                            scheduleJSON: scheduleJSON
                        });
                    }
                }
                break;
            case 'getReportcard':
                let token4 = escapeHTML(req.headers.authorization.split(' ')[1]);
                let userInfoBdd4 = await bdd.getUser(token4);
                if (userInfoBdd4) {
                    if (userInfoBdd4.length > 0) {
                        let reportcardJSON = fs.readFileSync('./userdata/' + token4 + '/reportcard.json', 'utf8');
                        res.send({
                            status: true,
                            reportcardJSON: reportcardJSON
                        });
                    }
                }
                break;
        }
    }
});



//Automation scripts
setInterval(() => {
    //vérifier si l'utilisateur n'a pas de notification
    infos.unSeen();
    infos.ping();
}, 30000);


//start the server on port 3000
server.listen(config.port, () => {
    console.log(`[CREATOR LAB] is running on port ${config.port}`);
});