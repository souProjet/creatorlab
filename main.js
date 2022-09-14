const express = require('express');
const fileupload = require('express-fileupload');
const mysql = require('mysql');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const HOME = process.argv.includes('--dev') ? './utils' : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.creatorlab_data";
const HOME_USERDATA = process.argv.includes('--dev') ? __dirname : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.creatorlab_data";
const config = require(HOME + '/config.json') // Configuration du serveur web et de la base de données MySQL
const fetch = require('node-fetch')
const fs = require('fs');
const utf8 = require('utf8');

//#############################################################################################################################
//                                               CONNEXION A LA BASE DE DONNEES
//#############################################################################################################################
const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
db.connect(function(err) {
    if (err) throw err;
    console.log("[CREATOR LAB] Connexion à la base de données mysql réussie");
});

//#############################################################################################################################
//                                               CONFIGURATION DU SERVEUR WEB
//#############################################################################################################################
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/asset'));

//#############################################################################################################################
//                                               IMPORT DES MODULES
//#############################################################################################################################
const Login = require('./modules/login');
const Cloud = require('./modules/cloud');
const Privatemessage = require('./modules/privatemessage');
const User = require('./modules/user');
const Notification = require('./modules/notification');
const Course = require('./modules/course');
const Note = require('./modules/note');
const Schedule = require('./modules/schedule');
const Reportcard = require('./modules/reportcard');

//#############################################################################################################################
//                                               INSTANCIATION DES MODULES
//#############################################################################################################################
const login = new Login(db, fetch, fs, https, puppeteer);
const cloud = new Cloud(fs, utf8);
const privatemessage = new Privatemessage(fetch);
const user = new User(db);
const notification = new Notification(fetch);
const course = new Course(fetch);
const note = new Note(db);
const schedule = new Schedule(fs);
const reportcard = new Reportcard(fs);

//#############################################################################################################################
//                                               FONCTION ECHAPPEMENT DE CARACTERES HTML
//#############################################################################################################################
function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\//g, '&#x2F;')
}

//#############################################################################################################################
//                                               DÉCLARATION DE VARIABLES
//#############################################################################################################################
let elycoState = false;
let pronoteState = false;

//#############################################################################################################################
//                                               WEB SOCKET
//#############################################################################################################################
io.on('connection', socket => {

    //utilisation des websockets:
    // - nouvelles notifications aux utilisateurs connectés
    // - nouveaux messages privés aux utilisateurs connectés
    // - nouveaux post dans le feed

    socket.on('join', async(data) => {
        let token = escapeHTML(data.token);
        socket.join(socket.id);
        //on vérifie si le token est valide pour cela il faut déjà récupérer le sessionId associé au token
        let returnData = await login.getSessionIds(token);
        if (returnData.status) {
            //on récupère le sessionId
            let sessionId = returnData.sessionId;
            //vérifier si le sessionId est valide
            let returnData2 = await login.checkSessionId(sessionId);
            if (returnData2.status) {
                let name = returnData2.name;
                let avatar = returnData2.avatar;
                let isSuccess = await login.updateNameAndAvatar(token, name, avatar);
                if (isSuccess) {
                    //ajouter le socketId de l'utilisateur dans la base de données et on l'ajoute dans la liste des utilisateurs connectés au websocket
                    let returnData3 = await login.updateSocketId(token, socket.id);
                    if (returnData3.status) {
                        io.to(socket.id).emit('join', { status: true, message: 'Vous êtes connecté', username: name, avatar: avatar });
                        //une fois l'utilisateur connecté, on lui envoie les notifications et les messages privés ainsi que les informations sur l'utilisateur

                    } else {
                        io.to(socket.id).emit('join', { status: false, message: returnData3.message });
                    }
                } else {
                    io.to(socket.id).emit('join', { status: false, message: 'Impossible de vous connecter' });
                }
            } else {
                io.to(socket.id).emit('join', { status: false, message: returnData2.message });
            }
        } else {
            io.to(socket.id).emit('join', { status: false, message: returnData.message });
        }
    });

    //#############################################################################################################################
    //                                             DEMANDE DES MESSAGES PRIVÉS VIA WEBSOCKET
    //#############################################################################################################################
    socket.on('getprivatemessages', async({ token, pageIndex }) => {
        token = escapeHTML(token);
        pageIndex = parseInt(pageIndex);

        //on vérifie si le token est valide pour cela il faut déjà récupérer le sessionId associé au token
        let returnData = await login.getSessionIds(token);
        if (returnData.status) {
            //on récupère le sessionId
            let sessionId = returnData.sessionId;

            let privatemessages = await privatemessage.getPrivatemessages(sessionId, pageIndex);
            if (privatemessages.status) {
                let formatedMessages = privatemessage.formatPrivatemessages(privatemessages.message);
                if (formatedMessages.status) {
                    socket.emit('privatemessages', {
                        status: true,
                        privatemessages: formatedMessages.privatemessages
                    })
                }
            }
        }
    });
    //#############################################################################################################################
    //                                      DEMANDE D'UNE CONVERSATION DE MESSAGES PRIVÉS VIA WEBSOCKET
    //#############################################################################################################################
    socket.on('getprivatemessageconv', async({ token, convId, pageIndex }) => {
        token = escapeHTML(token);
        convId = parseInt(convId);
        pageIndex = parseInt(pageIndex);

        //on vérifie si le token est valide pour cela il faut déjà récupérer le sessionId associé au token
        let returnData = await login.getSessionIds(token);
        if (returnData.status) {
            //on récupère le sessionId
            let sessionId = returnData.sessionId;
            let conv = await privatemessage.getPrivatemessages(sessionId, pageIndex);
            if (conv.status) {
                let formatedConv = privatemessage.formatConv(conv.message, convId);
                if (formatedConv.status) {
                    socket.emit('privatemessageconv', {
                        status: true,
                        conv: formatedConv.conv
                    });
                }
            }
        }
    });

    socket.on('disconnect', () => {
        //une fois l'utilisateur déconnecté, on supprime son socketId de la base de données et on le supprime de la liste des utilisateurs connectés au websocket
        socket.leave(socket.id);
    });
});


//#############################################################################################################################
//                                               ROUTES
//#############################################################################################################################
//requêtes GET sur la racine du site
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/template/accueil.html');
});
//requêtes GET sur la page "welcome"
app.get('/welcome', (req, res) => {
    res.sendFile(__dirname + '/template/index.html');
});
//requête sur le manifest.json
app.get('/manifest.json', (req, res) => {
    res.sendFile(__dirname + '/manifest.json');
});
//requête sur le sw.js
app.get('/sw.js', (req, res) => {
    res.sendFile(__dirname + '/sw.js');
});
//requête sur la page offline.html
app.get('/offline', (req, res) => {
    res.sendFile(__dirname + '/template/offline.html');
});


//#############################################################################################################################
//                                               RENVOIE STATIC DES DONNÉES "STORAGE"
//#############################################################################################################################
app.get('/storage/:token/:id/:ext', async(req, res) => {
    let token = escapeHTML(req.params.token);
    let id = escapeHTML(req.params.id);
    let ext = escapeHTML(req.params.ext);

    //retourner le fichier qui est dans /userdata/token/data/id.ext 
    res.sendFile(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.' + ext);
});

//requêtes GET sur la page de connexion
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/template/login.html');
});

//#############################################################################################################################
//                                               ROUTES DE L'API
//#############################################################################################################################
//requêtes en POST sur l'API
app.post('/api/\*', async(req, res) => {
    //l'utilisation du POST est résérvée aux requêtes qui ont un body (donc une requête avec un corps)
    let params = [];
    for (let i = 2; i < req.url.split('/').length; i++) {
        params.push(req.url.split('/')[i]);
    }
    switch (params[0]) {
        case 'login':
            //requête de connexion avec dans le body le login et le mot de passe
            let username = escapeHTML(req.body.username).toLowerCase();
            let password = escapeHTML(req.body.password);
            if (username && password && username.length > 0 && password.length > 0) {
                let returnData = await login.loginToEduconnect(0, username, password);
                if (returnData.status) {
                    let sessionId = returnData.sessionId;
                    let shibsession = returnData.shibsession;
                    //si l'id est valide, on regarde si l'utilisateur est déjà enregistré dans la base de données
                    let userWithSameUsername = await login.getUserByUsername(username);
                    if (userWithSameUsername.length > 0) {
                        //si oui, cela veux dire que l'utilisateur est déjà enregistré on le met donc à jour
                        let returnData = await login.updateUserSessionIdByUsername(username, sessionId);
                        res.cookie('token', returnData.token);
                        let shibsessionReturnedData = await login.updateShibsessionByUsername(username, shibsession);
                        if (shibsessionReturnedData.status) {
                            res.status(200).send({
                                status: true,
                                message: 'Connexion réussie'
                            });
                        } else {
                            res.status(200).send({
                                status: false,
                                message: shibsessionReturnedData.message
                            });
                        }
                    } else {
                        //si non, cela veux dire que l'utilisateur n'est pas enregistré on l'enregistre
                        let returnData = await login.createUser(username, sessionId);
                        if (returnData.status) {
                            cloud.createUserDataProfile(returnData.token);
                            res.cookie('token', returnData.token,
                                //  {
                                //     expires: new Date(Number(new Date()) + 315360000000),
                                //     httpOnly: process.argv.includes('--dev') ? false : true
                                // }
                            );
                            let shibsessionReturnedData = await login.updateShibsessionByUsername(username, shibsession);
                            if (shibsessionReturnedData.status) {
                                res.status(200).send({
                                    status: true,
                                    message: 'Connexion réussie'
                                });
                            } else {
                                res.status(200).send({
                                    status: false,
                                    message: shibsessionReturnedData.message
                                });
                            }
                        } else {
                            res.status(200).send({
                                status: false,
                                message: returnData.message
                            });
                        }
                    }
                } else {
                    //si l'id n'est pas valide, on renvoie une erreur
                    res.status(200).send({
                        status: false,
                        message: returnData.message
                    });
                }
            } else {
                //si l'utilisateur n'a pas rentré de login ou de mot de passe, on renvoie une erreur
                res.status(200).send({
                    status: false,
                    message: 'Veuillez entrer un login et un mot de passe'
                });
            }
            break;
        case 'connect':
            //récupérer le token dans l'entête de la requête
            let token = escapeHTML(req.headers.authorization.split(' ')[1]);
            let resultData = await login.getSessionIds(token);
            if (resultData.status) {
                let sessionId = resultData.sessionId;
                let shibsession = resultData.shibsession;
                //soit E-lyco (/api/connect/elyco) soit Pronote (/api/connect/pronote)
                let instance = params[1];
                if (instance == 'elyco') {
                    //si c'est E-lyco, on récupère l'antiforgeryToken et on le met à jour dans la base de données
                    let resultData = await login.updateAntiforgeryToken(token);
                    if (resultData.status) {


                        // //vérifier si on a accàs aux cours de l'utilisateur
                        let coursesAccessReturnedData = await login.checkCoursesAccess(sessionId);
                        if (coursesAccessReturnedData.status) {
                            elycoState = true;
                            res.status(200).send({
                                status: true,
                                message: 'Connexion à E-lyco réussie'
                            });
                            //Envoyer les notifications et les messages privés à l'utilisateur
                            //On commence par récuperer le socketId de l'utilisateur pour pourvoir envoyer les notifications et les messages privés via websocket
                            resultData = await user.getSocketIdByToken(token);
                            if (resultData.status) {
                                let socketId = resultData.socketId;

                                //#############################################################################################################################
                                //                                             RÉCUPÉRATION DES NOTIFICATIONS VIA E-LYCO
                                //#############################################################################################################################
                                notificationReturnedData = await notification.getNotifications(sessionId);
                                if (notificationReturnedData.status) {
                                    //il faut formater les notifications reçu pour avoir un beau JSON contenant les notifications
                                    let notifications = notificationReturnedData.message;
                                    let formatReturnedData = notification.formatNotifications(notifications);
                                    if (formatReturnedData.status) {
                                        //on envoie les notifications à l 'utilisateur via websocket

                                        let unseen = await notification.getUnSeenNotifications(sessionId);
                                        io.to(socketId).emit('notifications', {
                                            status: true,
                                            notifications: formatReturnedData.message,
                                            nbrunseen: unseen.status ? unseen.nbrunseen : 0
                                        });

                                    } else {
                                        io.to(socketId).emit('notifications', {
                                            status: false,
                                            message: 'Erreur lors de la récupération des notifications'
                                        });
                                    }
                                } else {
                                    io.to(socketId).emit('notifications', {
                                        status: false,
                                        message: 'Erreur lors de la récupération des notifications'
                                    });
                                }

                                //#############################################################################################################################
                                //                                             RÉCUPÉRATION DES MESSAGES PRIVÉS VIA E-LYCO
                                //#############################################################################################################################
                                privatemessageReturnedData = await privatemessage.getPrivatemessages(sessionId);
                                if (privatemessageReturnedData.status) {
                                    //il faut formater les notifications reçu pour avoir un beau JSON contenant les notifications
                                    let privatemessages = privatemessageReturnedData.message;

                                    let formatReturnedData = privatemessage.formatPrivatemessages(privatemessages);
                                    if (formatReturnedData.status) {
                                        //on envoie les messages privés à l'utilisateur via websocket
                                        let unseen = await privatemessage.getUnSeenPrivateMessages(sessionId);

                                        io.to(socketId).emit('privatemessages', {
                                            status: true,
                                            privatemessages: formatReturnedData.privatemessages,
                                            nbrunseen: unseen.status ? unseen.nbrunseen : 0
                                        });
                                    } else {
                                        io.to(socketId).emit('privatemessages', {
                                            status: false,
                                            message: 'Erreur lors de la récupération des messages privés'
                                        });
                                    }
                                } else {
                                    io.to(socketId).emit('privatemessages', {
                                        status: false,
                                        message: 'Erreur lors de la récupération des messages privés'
                                    });
                                }
                            } else {
                                //Il y a eu une erreur lors de la récupération du socketId de l'utilisateur
                            }
                        } else {
                            res.status(200).send({
                                status: false,
                                message: 'Connxion  à E-lyco échouée'
                            });
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: 'Connexion à E-lyco échouée'
                        });
                    }
                } else if (instance == 'pronote') {
                    //si c'est Pronote, on lance un scraping puppeteer pour récupérer les informations de l'utilisateur comme l'emploi du temps et les notes
                    const browser = await puppeteer.launch({ headless: true });
                    const page = await browser.newPage();
                    let resultData = await login.connectToPronote(page, shibsession);
                    browser.close();
                    if (resultData.status) {
                        pronoteState = true;
                        let scheduleSuccess = resultData.schedule;
                        let reportcardSuccess = resultData.reportcard;

                        let isSucess = schedule.updateSchedule(token, scheduleSuccess);
                        if (isSucess) {
                            isSucess = reportcard.updateReportcard(token, reportcardSuccess);

                            if (isSucess) {
                                res.status(200).send({
                                    status: true,
                                    schedule: (scheduleSuccess != '' && scheduleSuccess) ? true : false,
                                    reportcard: (reportcardSuccess != '' && reportcardSuccess) ? true : false,
                                    message: 'Connexion à Pronote réussie'
                                });
                            } else {
                                res.status(200).send({
                                    status: false,
                                    message: 'Erreur lors de la récupération du bulletin de notes'
                                });
                            }
                        } else {
                            res.status(200).send({
                                status: false,
                                message: 'Erreur lors de la récupération de l\'emploi du temps'
                            });
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: 'Connexion à Pronote échouée'
                        });
                    }
                } else {
                    res.status(200).send({
                        status: false,
                        message: 'Instance inconnue'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Token invalide'
                });
            }
            break;
        case 'cloud':
            //récupérer le token dans l'entête de la requête
            let token2 = escapeHTML(req.headers.authorization.split(' ')[1]);
            let resultData2 = await login.getSessionIds(token2);
            if (resultData2.status) {
                let sessionId = resultData2.sessionId;
                //déterminer la sous-action de la requête
                let subAction = params[1];
                if (subAction == 'get') {
                    let filter = req.body.filter;
                    if (filter == false) {
                        let dataReturnedData = cloud.get(token2, false);
                        if (dataReturnedData.status) {
                            res.status(200).send({
                                status: true,
                                data: dataReturnedData.data
                            });
                        } else {
                            res.status(200).send({
                                status: false,
                                message: dataReturnedData.message
                            });
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: 'Filtre non supporté pour l\'instant'
                        });
                    }
                } else if (subAction == 'getfile') {
                    let fileId = req.body.fileId ? escapeHTML(req.body.fileId) : null;

                    let file = cloud.getFile(token2, fileId);
                    if (file.status) {
                        res.status(200).send({
                            status: true,
                            file: file.file
                        });
                    } else {
                        res.status(200).send({
                            status: false,
                            message: file.message
                        });
                    }

                } else if (subAction == 'createfolder') {
                    let path = req.body.path ? escapeHTML(req.body.path) : null;
                    let isSuccess = cloud.createFolder(token2, path);
                    res.status(200).send({
                        status: isSuccess,
                        message: isSuccess ? 'Dossier créé' : 'Erreur lors de la création du dossier'
                    });
                } else if (subAction == 'delete') {
                    let id = req.body.id ? escapeHTML(req.body.id) : null;
                    let isFile = !!req.body.isFile;
                    let ext = req.body.ext ? escapeHTML(req.body.ext) : null;
                    let isUploadedFile = req.body.isUploadedFile ? JSON.parse(req.body.isUploadedFile) : null;
                    let isSuccess = cloud.delete(token2, id, isFile, isUploadedFile, ext);
                    res.status(200).send({
                        status: isSuccess,
                        message: isSuccess ? 'suppression effectuée' : 'Erreur lors de la suppression'
                    });
                } else if (subAction == 'createfile') {
                    let parentId = req.body.parentId ? escapeHTML(req.body.parentId) : null;
                    let fileId = cloud.createFile(token2, parentId);
                    if (fileId.status) {
                        res.status(200).send({
                            status: true,
                            fileId: fileId.fileId
                        });
                    } else {
                        res.status(200).send({
                            status: false,
                            message: fileId.message
                        });
                    }
                } else if (subAction == 'rename') {
                    let id = req.body.id ? escapeHTML(req.body.id) : null;
                    let newName = req.body.newName ? escapeHTML(req.body.newName) : null;
                    let isUploadedFile = req.body.isUploadedFile ? JSON.parse(req.body.isUploadedFile) : null;
                    let isFile = !!req.body.isFile;
                    if (newName) {
                        let isSuccess = cloud.rename(token2, id, newName, isFile, isUploadedFile);
                        res.send({
                            status: isSuccess,
                            message: isSuccess ? 'Renommage effectué' : 'Erreur lors du renommage'
                        });
                    } else {
                        res.send({
                            status: false,
                            message: 'Nom de fichier invalide'
                        });
                    }
                } else if (subAction == 'savefile') {
                    let fileId = req.body.fileId ? escapeHTML(req.body.fileId) : null;
                    let content = req.body.content
                    if (content) {
                        if (fileId) {
                            let isSuccess = cloud.saveFile(token2, fileId, content);
                            res.send({
                                status: isSuccess,
                                message: isSuccess ? 'Sauvegarde effectuée' : 'Erreur lors de la sauvegarde'
                            });
                        } else {
                            res.send({
                                status: false,
                                message: 'Id de fichier invalide'
                            });
                        }
                    }
                } else if (subAction == 'upload') {
                    let parentId = req.body.parentId ? escapeHTML(req.body.parentId) : null;
                    let filesUpload = req.files;
                    let nbrFiles = req.body.nbrFiles;

                    if (filesUpload) {
                        let success = true;
                        let error = '';
                        for (let i = 0; i < nbrFiles; i++) {
                            let file = filesUpload["file" + i];
                            file.name = utf8.decode(file.name);

                            if (file.size < 100000000) {
                                let totalSize = cloud.getTotalSize(token2).size + file.size;
                                //5Go = 5000000000 octets
                                if (totalSize <= 5000000000) {
                                    let returnState = cloud.upload(token2, parentId, file);
                                    success = returnState.status;
                                    error += (returnState.message != null ? returnState.message + "\n" : "");
                                } else {
                                    success = false;
                                    error += "Vous ne pouvez pas dépasser 5Go de stockage total";
                                }
                            } else {
                                success = false;
                                error += "Sorry, 100Mo max pour " + file.name + "\n";
                            }
                        }
                        res.send({
                            status: success,
                            message: error
                        });
                    } else {
                        res.send({
                            status: false,
                            message: 'Aucun fichier n\'a été uploadé'
                        });
                    }
                } else if (subAction == 'uploadthumbnail') {
                    let file = req.body.file;
                    let fileId = req.body.fileId ? escapeHTML(req.body.fileId) : null;
                    let base64Data = new Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    let isSuccess = cloud.uploadThumbnail(token2, fileId, base64Data);
                    res.send({
                        status: isSuccess,
                        message: isSuccess ? 'Upload effectué' : 'Erreur lors de l\'upload'
                    });
                } else if (subAction == 'getthumbnail') {
                    let fileId = req.body.fileId ? escapeHTML(req.body.fileId) : null;
                    let isSuccess = cloud.getThumbnail(token2, fileId);
                    if (isSuccess.status) {
                        res.status(200).send({
                            status: true,
                            thumbnail: isSuccess.thumbnail
                        });
                    } else {
                        res.status(200).send({
                            status: false,
                            message: isSuccess.message
                        });
                    }

                } else if (subAction == 'totalsize') {
                    let totalSize = cloud.getTotalSize(token2);
                    res.send({
                        status: true,
                        size: totalSize.size
                    });
                } else {
                    res.status(200).send({
                        status: false,
                        message: subAction + ' method inconnue'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Token invalide'
                });
            }
            break;
        case 'note':
            //récupérer le token présent dans l'entête de la requête
            let token3 = escapeHTML(req.headers.authorization.split(' ')[1]);

            let resultData3 = await login.getSessionIds(token3);
            if (resultData3.status) {
                let sessionId = resultData3.sessionId;
                //déterminer la sous-action de la requête
                let subAction = params[1];
                if (subAction == 'add') {
                    let content = req.body.content ? escapeHTML(req.body.content) : null;
                    let date = req.body.date ? escapeHTML(req.body.date) : null;
                    if (content && date && content.length > 0 && date.length > 0) {
                        let isSuccess = note.add(token3, content, date);
                        res.send({
                            status: isSuccess.status,
                            message: isSuccess.status ? 'Note ajoutée' : 'Erreur lors de l\'ajout de la note',
                            noteId: isSuccess.noteId
                        });
                    } else {
                        res.send({
                            status: false,
                            message: 'Données invalides'
                        });
                    }
                } else if (subAction == 'get') {
                    let isSuccess = await note.get(token3);
                    res.send({
                        status: isSuccess.status,
                        message: isSuccess.status ? 'Notes récupérées' : 'Erreur lors de la récupération des notes',
                        notes: isSuccess.notes
                    });
                } else if (subAction == 'delete') {
                    let noteId = req.body.noteId ? escapeHTML(req.body.noteId) : null;
                    if (noteId) {
                        let isSuccess = note.delete(token3, noteId);
                        res.send({
                            status: isSuccess.status,
                            message: isSuccess.status ? 'Note supprimée' : 'Erreur lors de la suppression de la note'
                        });
                    } else {
                        res.send({
                            status: false,
                            message: 'Id de note invalide'
                        });
                    }
                } else {
                    res.status(200).send({
                        status: false,
                        message: subAction + ' method inconnue'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Token invalide'
                });
            }


            break;
        case 'privatemessage':
            //récupérer le token dans l'entête de la requête
            let token4 = escapeHTML(req.headers.authorization.split(' ')[1]);

            //déterminer la sous-action de la requête
            let subAction4 = params[1];
            let resultData4 = await login.getSessionIds(token4);
            if (resultData4.status) {
                let sessionId = resultData4.sessionId;
                let antiforgeryToken = resultData4.antiforgeryToken
                if (subAction4 == 'send') {
                    let convId = parseInt(req.body.convId);
                    let text = escapeHTML(req.body.text);
                    if (convId && text) {
                        let sendReturnedData = await privatemessage.send(sessionId, antiforgeryToken, convId, text);
                        res.status(200).send({
                            status: sendReturnedData.status,
                            message: sendReturnedData.message
                        })
                    }

                } else {
                    res.status(200).send({
                        status: false,
                        message: subAction3 + ' : methode inconnue'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Token invalide'
                });
            }
            break;
    }


});
//requêtes en GET sur l'API
app.get('/api/\*', async(req, res) => {
    let params = [];
    for (let i = 2; i < req.url.split('/').length; i++) {
        params.push(req.url.split('/')[i]);
    }
    switch (params[0]) {
        case 'courses':
            if (elycoState) {

                //récupérer le token dans l'entête de la requête
                let token = escapeHTML(req.headers.authorization.split(' ')[1]);

                //déterminer la sous-action de la requête
                let subAction = params[1];
                let resultData = await login.getSessionIds(token);
                if (resultData.status) {
                    let sessionId = resultData.sessionId;
                    if (subAction == 'preview') {

                        //on récupère les cours via E-lyco
                        coursesReturnedData = await course.getCoursesPreview(sessionId);
                        if (coursesReturnedData.status) {
                            //il faut formater les cours reçu pour avoir un beau JSON contenant les cours
                            let courses = coursesReturnedData.message;
                            let formatReturnedData = course.formatCoursesPreview(courses);
                            if (formatReturnedData.status) {
                                //on envoie les cours à l'utilisateur en response
                                res.status(200).send({
                                    status: true,
                                    courses: formatReturnedData.courses
                                });
                            } else {
                                res.status(200).send({
                                    status: false,
                                    message: 'Aucun cours disponible'
                                });
                            }
                        } else {
                            res.status(200).send({
                                status: false,
                                message: 'Erreur lors de la récupération des cours'
                            });
                        }

                    } else if (subAction == 'details') {
                        let courseID = escapeHTML(params[2]);
                        //on récupère les détails des cours via E-lyco
                        if (courseID) {
                            coursesReturnedData = await course.getCourseDetail(sessionId, courseID);

                            if (coursesReturnedData.status) {
                                //il faut formater les cours reçu pour avoir un beau JSON contenant les cours
                                let courses = coursesReturnedData.message;
                                let formatReturnedData = course.formatCourseDetail(courses);
                                if (formatReturnedData.status) {
                                    //on envoie les cours à l'utilisateur en response
                                    res.status(200).send({
                                        status: true,
                                        course: {
                                            course: formatReturnedData.data,
                                            courseId: courseID
                                        }
                                    });
                                } else {
                                    res.status(200).send({
                                        status: false,
                                        message: 'Aucun cours disponible'
                                    });
                                }
                            } else {
                                res.status(200).send({
                                    status: false,
                                    message: 'Erreur lors de la récupération des cours'
                                });
                            }
                        } else {
                            res.status(200).send({
                                status: false,
                                message: 'Identifiant de cours manquant'
                            });
                        }


                    } else if (subAction == 'plan') {
                        let courseID = escapeHTML(params[2]);
                        let planID = escapeHTML(params[3]);
                        if (courseID && planID) {
                            // //on récupère le plan via E-lyco
                            // planReturnedData = await course.getPlan(sessionId, courseID, planID);
                            // if (planReturnedData.status) {
                            //     //il faut formater le plan reçu pour avoir un beau JSON contenant le plan
                            //     let plan = planReturnedData.message;
                            //     let formatReturnedData = course.formatPlan(plan);
                            //     if (formatReturnedData.status) {
                            //         //on envoie le plan à l'utilisateur en response
                            //         res.status(200).send({
                            //             status: true,
                            //             plan: formatReturnedData.plan
                            //         });
                            //     } else {
                            //         res.status(200).send({
                            //             status: false,
                            //             message: 'Aucun plan disponible'
                            //         });
                            //     }
                            // } else {
                            //     res.status(200).send({
                            //         status: false,
                            //         message: 'Erreur lors de la récupération du plan'
                            //     });
                            // }
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: subAction + ' : methode inconnue'
                        });
                    }
                } else {
                    res.status(200).send({
                        status: false,
                        message: 'Token invalide'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Vous n\'êtes pas connecté à E-lyco'
                });
            }
            break;
        case 'schedule':
            //récupérer le token dans l'entête de la requête
            let token2 = escapeHTML(req.headers.authorization.split(' ')[1]);

            //déterminer la sous-action de la requête
            let subAction2 = params[1];
            let resultData2 = await login.getSessionIds(token2);
            if (resultData2.status) {
                if (subAction2 == 'get') {
                    let scheduleReturnedData = schedule.get(token2);
                    if (scheduleReturnedData.status) {
                        if (scheduleReturnedData.schedule != '{}') {
                            res.send({
                                status: true,
                                message: scheduleReturnedData.message,
                                schedule: scheduleReturnedData.schedule
                            });
                        } else {
                            res.status(200).send({
                                status: false,
                                message: "Aucun emplois du temps trouvé"
                            });
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: scheduleReturnedData.message
                        })
                    }
                } else {
                    res.status(200).send({
                        status: false,
                        message: subAction2 + ' : methode inconnue'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Token invalide'
                });
            }
            break;
        case 'reportcard':
            //récupérer le token dans l'entête de la requête
            let token3 = escapeHTML(req.headers.authorization.split(' ')[1]);

            //déterminer la sous-action de la requête
            let subAction3 = params[1];
            let resultData3 = await login.getSessionIds(token3);
            if (resultData3.status) {
                if (subAction3 == 'get') {
                    let reportcardReturnedData = reportcard.get(token3);
                    if (reportcardReturnedData.status) {
                        if (reportcardReturnedData.reportcard != '{}') {
                            res.send({
                                status: true,
                                message: reportcardReturnedData.message,
                                reportcard: reportcardReturnedData.reportcard
                            });
                        } else {
                            res.status(200).send({
                                status: false,
                                message: "Aucun bulletin de note trouvé"
                            });
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: reportcardReturnedData.message
                        })
                    }
                } else {
                    res.status(200).send({
                        status: false,
                        message: subAction3 + ' : methode inconnue'
                    });
                }
            } else {
                res.status(200).send({
                    status: false,
                    message: 'Token invalide'
                });
            }
            break;

            // case 'notification':
            //     break;
        case 'user':
            break;
    }
});

//######################################################################################################################
//                                             ERREUR 404
//######################################################################################################################
app.get('*', (req, res) => {
    res.redirect('/');
});
app.post('*', (req, res) => {
    res.status(404).send('Method inconnue')
});


//#############################################################################################################################
//                                               LANCEMENT DU SERVEUR SUR LE PORT 3000
//#############################################################################################################################
server.listen(config.port, () => {
    console.log(`[CREATOR LAB] Le serveur est lancé sur le port ${config.port}`);
});