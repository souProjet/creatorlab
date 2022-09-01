document.cookie.indexOf('token') == -1 ? window.location = '/welcome' : null;

let socket = io(); //on se connecte au websocket

let disconnectedBtn = document.querySelector('.disconnected-btn');
let mainContainer = document.querySelector('.main_content');
let mainContent = document.querySelector('.main_content .mcontainer');
let sidebarItems = document.querySelectorAll('.sidebar_inner ul li');
let sidebar = document.querySelector('.sidebar_inner ul');
let loader = document.querySelector('.connection-box');

let nameField = document.querySelector('.user_name > div');
let avatarField = document.querySelector('.user_avatar > img');
let avatarField2 = document.querySelector('.is_avatar');
let userGeneralMean = document.querySelector('.user_name > p');

let elycoState = false;
let pronoteState = false;

let accueilHTMLpage = ``;

let utils = new Utils(); //on crée un objet utils pour pouvoir utiliser les fonctions outils

let token = utils.getToken(); //on récupère le token stocké dans les cookies

let reportcard = {};
let schedule = {};

socket.emit('join', { token: token }); //on envoie le token au websocket pour qu'il l'ajoute à la liste des utilisateurs connectés

socket.on('join', (data) => {
    if (data.status) {

        nameField.innerText = utils.escapeHTML(data.username);
        avatarField.src = data.avatar;
        avatarField2.src = data.avatar;

        mainContent.innerHTML += `<br>
        <div class="lg:flex lg:space-x-10">
            <div class="lg:w-full lg:px-20 space-y-7">
                <div class="relative -mt-3"> 
                    <div class="px-1 py-3">
                        <ul class="uk-child-width-1-3@m uk-child-width-1-2@s uk-grid-small uk-grid justify-around">
                            <li style="width:50%;">
                                <div class="card p-2 flex space-x-4 border border-gray-100">
                                    <div class="w-48 h-24 overflow-hidden rounded-lg">
                                        <div class="card-media h-24">
                                            <img src="./public/images/elyco.png" alt="" style="background-color:black;">
                                        </div>
                                    </div>
                                    <div class="flex-1 pt-2.5 relative">
                                        <div class="text-xs font-semibold uppercase text-red-500 flex elyco-connect-instance">En Attente<img class="loader-waiting"  src="./public/images/loader-waiting.svg"></div>
                                        <div class="text-lg mt-3 2.5 text-gray-700">E-lyco</div>
                                    </div>
                                </div>
                            </li>
                            <li style="width:50%;">
                                <div class="card p-2 flex space-x-4 border border-gray-100">
                                    <div class="w-48 h-24 overflow-hidden rounded-lg">
                                        <div class="card-media h-24">
                                            <img src="./public/images/pronote.png" alt="" style="background-color:black;">
                                        </div>
                                    </div>
                                    <div class="flex-1 pt-2.5 relative">
                                        <div class="text-xs font-semibold uppercase text-red-500 flex pronote-connect-instance">En Attente<img class="loader-waiting"  src="./public/images/loader-waiting.svg"></div>
                                        <div class="text-lg mt-3 2.5 text-gray-700">Pronote</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;


        //######################################################################################################################
        //                                              CONNEXION À E-LYCO
        //######################################################################################################################
        fetch('./api/connect/elyco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data => {
            let elycoConnectInstanceCard = document.querySelector('.elyco-connect-instance');
            if (data.status) {
                if (elycoConnectInstanceCard) {
                    elycoConnectInstanceCard.innerHTML = 'Connecté';
                    elycoConnectInstanceCard.classList.add('text-green-500');
                    elycoConnectInstanceCard.classList.remove('text-red-500');
                }
                elycoState = true;
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Mes cours') {
                        item.classList.remove('hide');
                    }
                });
            } else {
                if (elycoConnectInstanceCard) {
                    elycoConnectInstanceCard.innerHTML = 'Fermé';
                    elycoConnectInstanceCard.classList.add('text-red-500');
                    elycoConnectInstanceCard.parentNode.parentNode.style.border = "solid 1px red";
                    elycoConnectInstanceCard.parentNode.parentNode.setAttribute('uk-tooltip', 'title: Il semblerait que E-lyco soit fermé pour le moment');
                }
                document.querySelector('.notif-btn').remove();
                document.querySelector('.message-btn').remove();
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Mes cours') {
                        item.remove();
                    }
                });
            }
            document.querySelectorAll('.connection-box')[1] ? document.querySelectorAll('.connection-box')[1].remove() : null;
            loader ? loader.remove() : null;

            mainContainer.classList.remove('hide');
            sidebar.classList.remove('hide');
            accueilHTMLpage = mainContent.innerHTML;

            utils.updateSidebarLoaderState();
        }).catch(err => {
            console.log(err);
        });

        //######################################################################################################################
        //                                             CONNEXION À PRONOTE
        //######################################################################################################################
        fetch('./api/connect/pronote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data => {
            let pronoteConnectInstanceCard = document.querySelector('.pronote-connect-instance');
            if (data.status) {
                if (pronoteConnectInstanceCard) {
                    pronoteConnectInstanceCard.innerHTML = 'Connecté';
                    pronoteConnectInstanceCard.classList.add('text-green-500');
                    pronoteConnectInstanceCard.classList.remove('text-red-500');
                }
                pronoteState = true;

                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Emplois du temps' && data.schedule) {
                        item.classList.remove('hide')
                    }
                    if (item.querySelector('span').innerText == 'Mon bulletin' && data.reportcard) {
                        item.classList.remove('hide')
                    }
                });
            } else {
                if (pronoteConnectInstanceCard) {
                    pronoteConnectInstanceCard.innerHTML = 'Fermé';
                    pronoteConnectInstanceCard.classList.add('text-red-500');
                    pronoteConnectInstanceCard.parentNode.parentNode.style.border = "solid 1px red";
                    pronoteConnectInstanceCard.parentNode.parentNode.setAttribute('uk-tooltip', 'title: Il semblerait que Pronote soit fermé pour le moment.');
                }
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Emplois du temps' || item.querySelector('span').innerText == 'Mon bulletin') {
                        item.classList.add('hide');
                    }
                });
            }

            //######################################################################################################################
            //                                             RÉCUPÉRATION DU BULLETIN DE NOTES
            //######################################################################################################################
            fetch('/api/reportcard/get', {
                method: 'GET',
                headers: {
                    'Application-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(res => res.json()).then(data => {
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Mon bulletin' && data.reportcard) {
                        item.classList.remove('hide')
                    }
                });
                if (data.status) {
                    reportcard = JSON.parse(data.reportcard);
                    let offset_mean = 4;
                    document.querySelector('.user_name > p').style.fontSize = ".8em";
                    let dist_mean = Math.round((reportcard.general_student - reportcard.general_class) * -100) / -100;
                    dist_mean > offset_mean ? dist_mean = offset_mean : dist_mean < -offset_mean ? dist_mean = -offset_mean : dist_mean = dist_mean;
                    let g_mean = Math.floor(((dist_mean + offset_mean) * 256 / (offset_mean * 2)) - 1);
                    let r_mean = Math.floor(256 - ((dist_mean + offset_mean) * 256 / (offset_mean * 2)));
                    document.querySelector('.user_name > p').style.color = "rgb(" + (r_mean) + ", " + (g_mean) + ", 0)";
                    document.querySelector('.user_name > p').innerText = reportcard.general_student.toString().replace('.', ',') + ' de moyenne';
                } else {
                    console.log(data.message)
                }
            });

            //######################################################################################################################
            //                                             RÉCUPÉRATION DE L'EMPLOIS DU TEMPS
            //######################################################################################################################
            fetch('/api/schedule/get', {
                method: 'GET',
                headers: {
                    'Application-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(res => res.json()).then(data => {
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Emplois du temps' && data.schedule) {
                        item.classList.remove('hide')
                    }
                });
                if (data.status) {
                    schedule = JSON.parse(data.schedule);
                } else {
                    console.log(data.message)
                }
                if (!pronoteState) {
                    let notuptodateSVG = `
                    &nbsp;<svg uk-tooltip="title: Les données ne sont peut-être pas à jour" xmlns="http://www.w3.org/2000/svg" style="height:28px; width:24px;" fill="red" viewbox="0 0 44 44">
                        <path d="M24 34q.7 0 1.175-.475.475-.475.475-1.175 0-.7-.475-1.175Q24.7 30.7 24 30.7q-.7 0-1.175.475-.475.475-.475 1.175 0 .7.475 1.175Q23.3 34 24 34Zm-1.35-7.65h3V13.7h-3ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.975T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24.05 41ZM24 24Z" />
                    </svg>`;
                    sidebarItems.forEach(item => {
                        if (item.querySelector('span').innerText == 'Emplois du temps' || item.querySelector('span').innerText == 'Mon bulletin') {
                            item.querySelector('a').innerHTML += notuptodateSVG;
                        }
                    });
                    document.querySelector('.user_name > p').innerHTML += notuptodateSVG;
                    document.querySelector('.user_name > p').classList.add('flex');
                }
                utils.updateSidebarLoaderState();
            });
        }).catch(err => {
            console.log(err);
        });

        //######################################################################################################################
        //                                   AFFICHAGE DU STOCKAGE RESTANT SUR LE CLOUD PRIVÉ
        //######################################################################################################################
        fetch('./api/cloud/totalsize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data => {
            if (data.status) {
                let percent = Math.round(data.size / 5000000000 * 100);
                mainContent.innerHTML += `
                    <div class="lg:flex lg:space-x-10">
                        <div class="lg:w-full lg:px-20 space-y-7">
                            <div class="card p-2 flex space-x-4 border border-gray-100">
                                <div class="w-28 h-24 overflow-hidden rounded-lg">
                                    <div class="card-media h-24">
                                        <img src="./public/images/storage.png" alt="Storage icon">
                                    </div>
                                </div>
                                <div class="flex-1 pt-2.5 relative">
                                    <div class="flex justify-center text-lg mt-3 2.5 text-gray-700">Espace de stockage privé</div>
                                    <div class="mt-3 items-center">
                                        <div class="flex justify-center text-${percent > 50 ? (percent > 90 ? 'red' : 'orange') : 'green'}-500 font-medium mb-2">
                                            ${utils.octetToString(data.size)} sur 5 Go (${percent}%)
                                        </div>
                                        <div class="bg-gray-100 rounded-2xl h-2 w-full relative overflow-hidden">
                                            <div class="bg-${percent > 50 ? (percent > 90 ? 'red' : 'orange') : 'green'}-600 h-full" style="width:${percent}%;"></div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div><br>`;
            } else {
                console.log(data.message);
            }
        }).catch(err => {
            console.log(err);
        });

        //######################################################################################################################
        //                                             AFFICHAGE DES NOTES
        //######################################################################################################################
        fetch('./api/note/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data => {
            if (data.status) {
                let notes = data.notes;
                notes = notes.sort((a, b) => {
                    return new Date(a.forwhen).getTime() - new Date(b.forwhen).getTime();
                });

                for (let i = 0; i < notes.length; i++) {
                    let note = notes[i];
                    let today = new Date();
                    today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    let timeLeft = utils.calculateTimeBetweenTwoDates(today, note.forwhen)
                    mainContent.innerHTML += `
                        <div class="lg:flex lg:space-x-10 uk-animation-slide-bottom-small note mb-5" id="${note.token}">
                            <div class="lg:w-full lg:px-20 space-y-7">
                                <div class="card space-x-4" ${timeLeft == '1 jour restant' || timeLeft == 'aujourd\'hui' ? 'style="border:solid 1px red;"' : ''}>
                                    <div class="flex justify-between items-center lg:p-4 p-2.5">

                                        <div class="flex flex-1 items-center space-x-4">
                                        <a>
                                            <img src="${document.querySelector('.is_avatar').src}" class="bg-gray-200 border border-white rounded-full w-10 h-10">
                                        </a>
                                        <div class="flex-1 font-semibold ">
                                            <a class="text-black dark:text-gray-100">${document.querySelector('.user_name').innerText.split('\n')[1].trim()}</a>
                                                    <div class="text-gray-700 flex items-center space-x-2">
                                                        ${timeLeft} (${note.forwhen.split('-')[2] + '/' + note.forwhen.split('-')[1] + '/' + note.forwhen.split('-')[0]})
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                            <a href="#" aria-expanded="false" class="">
                                                <i class="uil-trash-alt text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-700"></i>
                                            </a>
                                            <div class="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 uk-drop uk-drop-bottom-right" uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small" style="left: 279.703px; top: 2.5px;">

                                                <ul class="space-y-1">
                                                    <li>
                                                        <a href onclick="deleteNote(event, '${note.token}')" class="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600">
                                                            <i class="uil-trash-alt mr-1"></i> Supprimer
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> 
                                    </div>
                                    <div class="p-5 pt-0 dark:border-gray-700">
                                        ${utils.replaceURLWithHTMLLinks(utils.htmlDecode(note.content))}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }

            } else {
                console.log(data.message);
            }
        }).catch(err => {
            console.log(err);
        });

    } else {
        loader.innerHTML = `<div>${data.message}</div>`;
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        window.location.href = '/login';
    }
});

//######################################################################################################################
//                                             RÉCÉPTION DES NOTIFICATIONS
//######################################################################################################################
socket.on('notifications', (data) => {
    if (data.status) {
        if (data.notifications.length > 0) {
            let notifsHTML = ``;

            data.notifs.forEach(notif => {
                let notifDate = notif.date.split(' ');
                notifsHTML += `<li>
                <a style="cursor:pointer;" class="courseNotif" id="${notif.courseId}">
                    <div class="drop_avatar">
                        <img src="${notif.img}" alt="">
                    </div>
                    <div class="drop_text">
                        <p>
                            <strong>${notif.matiere ? notif.matiere.replace("Accéder à ", '') : ''}</strong>&nbsppar ${notif.author}</span>
                        </p>
                        <time>${calculateTimeBetweenDateAndToday(new Date(parseInt(notifDate[3]), parseInt(monthByName[notifDate[2]]), parseInt(notifDate[1]), parseInt(notifDate[4].split(":")[0]), parseInt(notifDate[4].split(":")[1])), 0)}</time>
                    </div>
                </a>
            </li>`;
            });

            notificationBox.innerHTML = notifsHTML;
            notifsBox = document.querySelectorAll('.courseNotif');
            notifsBox.forEach(notif => {
                notif.addEventListener('click', (e) => {
                    let courseId = notif.getAttribute('id');
                    mainContainer.classList.add('hide');
                    socket.emit('viewCourse', {
                        token: token,
                        courseId: parseInt(courseId)
                    });
                    sidebarItems.forEach(sidebarItem => sidebarItem.classList.remove('active'));
                    sidebarItems[1].classList.add('active');
                });
            });

        } else {
            notificationBox.innerHTML = `<div class="drop_text"><p style="display:flex; justify-content:center;">Aucune notification</p></div>`;
        }
    }
});

//######################################################################################################################
//                                             RÉCÉPTION DES MESSAGES PRIVÉS
//######################################################################################################################

function onscroll() {
    let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
    let offsetScrollMessageBox = scrollMessageBox.scrollHeight - scrollMessageBox.clientHeight
    if (scrollMessageBox.scrollTop == (scrollMessageBox.scrollHeight - scrollMessageBox.clientHeight)) {
        if (scrollMessageBox.scrollTop == offsetScrollMessageBox) {
            scrollMessageBox.setAttribute('data-page', parseInt(scrollMessageBox.getAttribute('data-page') || 0) + 1);
            scrollMessageBox.scrollTop = offsetScrollMessageBox;
            offsetScrollMessageBox = scrollMessageBox.scrollHeight - scrollMessageBox.clientHeight;

            socket.emit("getprivatemessages", {
                token: token,
                pageIndex: parseInt(scrollMessageBox.getAttribute('data-page'))
            });
        }
    }
}

socket.on('privatemessages', (data) => {
    let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];

    let messageBox = document.querySelector('.message-box');
    document.querySelector('.message-reply') ? document.querySelector('.message-reply').remove() : '';
    if (data.status) {
        if (data.privatemessages.length > 0) {
            let messagesHTML = ``;
            data.privatemessages.forEach(message => {
                message.participants = message.participants.filter(participant => participant.name != document.querySelector('.user_name > div').innerHTML);
                messagesHTML += `<li>
                    <a style="cursor:pointer;" class="conv" id="${message.convId}">
                        <div class="drop_avatar"><img src="` + (message.type == "Group" ? './public/images/groupe.png' : message.participants[message.participants.length - 1].avatarUrl || './public/images/defaultAvatar.png') + `" alt="">
                        </div>
                        <div class="drop_text">
                            <strong>` + (message.type == "Group" ? message.lastMessage.authorName.replace('(44-BOUAYE)', '') : message.participants[message.participants.length - 1].name) + `</strong> <time>` + (utils.calculateTimeBetweenDateAndToday(new Date(parseInt(message.lastMessage.created.split('/')[2].split(' ')[0]), parseInt(message.lastMessage.created.split('/')[1]) - 1, parseInt(message.lastMessage.created.split('/')[0]), parseInt(message.lastMessage.created.split(' ')[1].split(":")[0]), parseInt(message.lastMessage.created.split(":")[1])))) + `</time>
                            <p>` + (message.lastMessage.text || message.lastMessage.attachmentName) + `</p>
                        </div>
                    </a>
                </li>`
            });
            messageBox.innerHTML = messagesHTML;
            //si l'utilisateur séléctionne une conversation

            document.querySelectorAll('.conv').forEach(conv => {
                conv.addEventListener('click', (e) => {
                    e.preventDefault();
                    messageBox.classList.add('slide');
                    let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
                    scrollMessageBox.removeEventListener('scroll',
                        onscroll,
                        false
                    );
                    setTimeout(() => {
                        messageBox.innerHTML = `<div class="drop_text"><p style="display:flex; justify-content:center;">Chargement de la conversation...&nbsp;<img style="height:30px; width:30px;" src="./public/images/loader-waiting2.svg"></p></div>`;
                        messageBox.classList.remove('slide');

                        socket.emit("getprivatemessageconv", {
                            token: token,
                            convId: conv.id,
                            pageIndex: parseInt(scrollMessageBox.getAttribute('data-page') || 0)
                        });

                    }, 300);
                });
            });

            scrollMessageBox.addEventListener('scroll', onscroll);

        } else {
            messageBox.innerHTML = `<div class="drop_text"><p style="display:flex; justify-content:center;">Aucun message</p></div>`;
        }
    }
});

socket.on('privatemessageconv', (data) => {
    let messageBox = document.querySelector('.message-box');
    let convTitle = document.querySelectorAll('.drop_headline > h4')[1];
    if (data.status) {
        if (data.conv) {
            conv = data.conv;
            conv.participants = conv.participants.filter(participant => participant.name != document.querySelector('.user_name > div').innerHTML);
            convTitle.innerHTML = `<button class="back-message"><img style="height:30px;margin-right:10px;" src="./public/images/back.svg"></button>` + (conv.type == "Group" ? conv.participants[conv.participants.length - 1].name.replace('(44-BOUAYE)', '') : conv.participants[conv.participants.length - 1].name);

            messageBox.id = conv.convId;
            let convHTML = ``;
            for (let i = 0; i < conv.messages.length; i++) {
                let message = conv.messages[i];
                convHTML += `
                <div id="${message.messageId}" class="message-bubble ` + (message.authorName == document.querySelector('.user_name > div').innerHTML ? 'me' : '') + `">
                    <div class="message-bubble-inner">
                        <div onclick="viewprofile(${parseInt(message.author)}, '${(message.authorAvatarUrl || './public/images/defaultAvatar.png')}', '${message.authorName.replace('(44-BOUAYE)', '').replace('\'', '\\\'')}', ${conv.readOnly})" style="cursor:pointer" class="message-avatar"><img src="` + (message.authorAvatarUrl || './public/images/defaultAvatar.png') + `" alt=""></div>
                        <div class="message-text"><p>${utils.replaceURLWithHTMLLinks(message.text)} ` + (message.attachmentUrl ? '<a href="' + message.attachmentUrl + '">' + message.attachmentName + '</a>' : '') + `</p></div>
                    </div>
                    <div class="clearfix"></div>
                </div>`;
                if (i == conv.messages.length - 1) {
                    convHTML += `
                    <div class="message-time-sign">
                        <span>` + (utils.calculateTimeBetweenDateAndToday(new Date(parseInt(message.created.split('/')[2].split(' ')[0]), parseInt(message.created.split('/')[1]) - 1, parseInt(message.created.split('/')[0]), parseInt(message.created.split(' ')[1].split(":")[0]), parseInt(message.created.split(":")[1])))) + `</span>
                    </div>`;

                }
            }

            messageBox.innerHTML = convHTML;
            if (!conv.readOnly) {
                document.querySelectorAll('.header_dropdown')[1].innerHTML += `
                <!-- Reply Area -->
                <div class="message-reply">
                    <!--<img src="./public/images/attachement.png" alt="" class="h-7 w-7 self-center mr-2 cursor-pointer">-->
                    <input type="file" name="attachment" id="attachment" class="hidden">
                    <textarea cols="1" rows="1" placeholder="Votre message"></textarea>
                    <button class="button ripple-effect">Envoyer</button>
                </div>`;
                document.querySelector('.message-reply > textarea').addEventListener('keyup', (e) => {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        document.querySelector('.message-reply > button').click();
                    }
                });


                document.querySelector('.message-reply > button').addEventListener('click', (e) => {
                    e.preventDefault();
                    let message = document.querySelector('.message-reply > textarea').value;
                    if (message.trim() != '') {

                        fetch('./api/privatemessage/send', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({
                                convId: parseInt(messageBox.id),
                                text: utils.escapeHTML(message)
                            })
                        }).then(response => response.json()).then(data => {
                            if (data.status) {
                                document.querySelector('.message-reply > textarea').value = '';
                                messageBox = document.querySelector('.message-box');
                                document.querySelector('.message-time-sign').remove();
                                messageBox.innerHTML += `
                                <div class="message-bubble me" id="${messageBox.id}">
                                    <div class="message-bubble-inner">
                                        <div class="message-avatar"><img src="${document.querySelector('.is_avatar').src}" alt=""></div>
                                        <div class="message-text"><p>${utils.replaceURLWithHTMLLinks(message)}</p></div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>`;
                                let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
                                scrollMessageBox.scrollTop = scrollMessageBox.scrollHeight;
                                document.querySelectorAll('.erreur-msg-chat').forEach(element => {
                                    element.remove();
                                });
                            } else {
                                console.log(data.message)
                            }
                        }).catch(error => {
                            console.log(error);
                        });

                    }
                });

                // document.querySelector('.message-reply > img').addEventListener('click', (e) => {
                //     e.preventDefault();
                //     document.querySelector('.message-reply > input').click();
                // });

                // document.querySelector('.message-reply > input').addEventListener('change', (e) => {
                //     e.preventDefault();
                //     let files = e.target.files;
                //     if (files) {
                //         const formData = new FormData();
                //         formData.append('fileAttachment', files[0]);
                //         fetch('/api/upload', {
                //             method: 'POST',
                //             headers: {
                //                 'Authorization': 'Bearer ' + token,
                //                 'Destination': 'elyco',
                //             },
                //             body: formData

                //         }).then(res => res.json()).then(data => {
                //             if (data) {
                //                 if (data.status) {

                //                     document.querySelectorAll('.erreur-msg-chat').forEach(element => {
                //                         element.remove();
                //                     });
                //                 }
                //                 // socket.emit('sendMessage', {
                //                 //     token: token,
                //                 //     convId: messageBox.id,
                //                 //     text: '',
                //                 //     attachmentUrl: data.url,
                //                 //     attachmentName: file.name
                //                 // });
                //                 // messageBox = document.querySelector('.message-box');
                //                 // document.querySelector('.message-time-sign').remove();
                //                 // messageBox.innerHTML += `
                //                 //     <div class="message-bubble me" id="${messageBox.id}">

                //                 //         <div class="message-bubble-inner">
                //                 //             <div class="message-avatar"><img src="${document.querySelector('.is_avatar').src}" alt=""></div>
                //                 //             <div class="message-text"><p>${utils.replaceURLWithHTMLLinks(file.name)}</p></div>
                //                 //         </div>
                //                 //         <div class="clearfix"></div>
                //                 //     </div>`;
                //                 // let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
                //                 // scrollMessageBox.scrollTop = scrollMessageBox.scrollHeight;
                //             } else {
                //                 document.querySelector('.message-reply').innerHTML += '<p class="text-red-500 text-center erreur-msg-chat">Erreur lors de l\'envoie du fichier</p>';
                //             }
                //             document.querySelector('.message-reply > input').value = '';
                //         }).catch(err => {
                //             console.log(err);
                //         });
                //     }
                // });
            }

            let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
            scrollMessageBox.scrollTop = scrollMessageBox.scrollHeight;

        }
    }
    let backMessageElement = document.querySelector('.back-message');

    backMessageElement.addEventListener('click', (e) => {
        e.preventDefault();
        socket.emit("getprivatemessages", {
            token: token,
            pageIndex: 0
        });
    });
});

//lorsque l'utilisateur clique sur un des onglets de la sidebar, on change l'onglet actif et on cache le mainContainer
function launchPage(pageName) {
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('span').innerHTML === pageName) {
            item.classList.add('active');
            if (pageName == 'Accueil') {
                mainContainer.classList.add('hide');
                mainContent.innerHTML = accueilHTMLpage;
                let pronoteConnectInstanceCard = document.querySelector('.pronote-connect-instance');
                if (pronoteState) {
                    pronoteConnectInstanceCard.innerHTML = 'Connecté';
                    pronoteConnectInstanceCard.classList.add('text-green-500');
                    pronoteConnectInstanceCard.classList.remove('text-red-500');
                } else {
                    pronoteConnectInstanceCard.innerHTML = 'Fermé';
                    pronoteConnectInstanceCard.classList.add('text-red-500');
                    pronoteConnectInstanceCard.parentNode.parentNode.style.border = "solid 1px red";
                    pronoteConnectInstanceCard.parentNode.parentNode.setAttribute('uk-tooltip', 'title: Il semblerait que Pronote soit fermé pour le moment.');
                }
                mainContainer.classList.remove('hide');
            } else {
                mainContainer.classList.add('hide');
            }
            localStorage.setItem('activePage', pageName);
        }
    });
}
let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
let noteDate = tomorrow;

function createNote(e) {
    if (e.type == 'keyup') {
        if (e.keyCode == 13) {
            if (e.target.value.length > 0) {
                let content = utils.escapeHTML(e.target.value);
                fetch('./api/note/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        content: content,
                        date: utils.escapeHTML(noteDate)
                    })
                }).then(res => res.json()).then(data => {
                    if (data.status) {
                        e.target.value = '';
                        utils.createModal('Note ajoutée !');
                        let HTMLnoteadd = `
                        <div class="lg:flex lg:space-x-10 uk-animation-slide-bottom-small note mb-5" id="${data.noteId}">
                            <div class="lg:w-full lg:px-20 space-y-7">
                                <div class="card space-x-4">
                                    <div class="flex justify-between items-center lg:p-4 p-2.5">
    
                                        <div class="flex flex-1 items-center space-x-4">
                                        <a>
                                            <img src="${document.querySelector('.is_avatar').src}" class="bg-gray-200 border border-white rounded-full w-10 h-10">
                                        </a>
                                        <div class="flex-1 font-semibold ">
                                            <a class="text-black dark:text-gray-100">${document.querySelector('.user_name').innerText.split('\n')[1].trim()}</a>
                                                    <div class="text-gray-700 flex items-center space-x-2">
                                                        Ajoutée à l'instant
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                            <a href="#" aria-expanded="false" class="">
                                                <i class="uil-trash-alt text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-700"></i>
                                            </a>
                                            <div class="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 uk-drop uk-drop-bottom-right" uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small" style="left: 279.703px; top: 2.5px;">
    
                                                <ul class="space-y-1">
                                                    <li>
                                                        <a href onclick="deleteNote(event, '${data.noteId}')" class="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600">
                                                            <i class="uil-trash-alt mr-1"></i> Supprimer
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> 
                                    </div>
                                    <div class="p-5 pt-0 dark:border-gray-700">
                                        ${utils.replaceURLWithHTMLLinks(content)}
                                    </div>
                                </div>
                            </div>
                        </div>`;

                        document.querySelector('.note') ? document.querySelector('.note').insertAdjacentHTML('beforebegin', HTMLnoteadd) : mainContent.innerHTML += HTMLnoteadd;
                        accueilHTMLpage = mainContent.innerHTML;
                    } else {
                        utils.createModal(data.message, false);
                        console.log(data.message);
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                e.target.placeholder = 'Veuillez entrer une note';
            }
        }
    } else if (e.type == 'change') {
        noteDate = e.target.value;
    }
}

function deleteNote(e, noteId) {
    e.preventDefault();
    e.stopPropagation();
    fetch('./api/note/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            noteId: noteId
        })
    }).then(res => res.json()).then(data => {
        if (data.status) {
            utils.createModal('Note supprimée !');
            document.getElementById(noteId).remove();
            accueilHTMLpage = mainContent.innerHTML;
        } else {
            utils.createModal(data.message, false);
            console.log(data.message);
        }
    }).catch(err => {
        console.log(err);
    });
}

disconnectedBtn.addEventListener('click', () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    window.location.href = '/login';
});


socket.on('disconnected', () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    window.location.href = '/login';
});