let socket = io(); //on se connecte au websocket

let disconnectedBtn = document.querySelector('.disconnected-btn');
let mainContainer = document.querySelector('.main_content');
let mainContent = document.querySelector('.main_content .mcontainer');
let sidebarItems = document.querySelectorAll('.sidebar_inner ul li');
let loader = document.querySelector('.connection-box');
let sidebarLoader = document.querySelectorAll('.connection-box')[1];

let nameField = document.querySelector('.user_name > div');
let avatarField = document.querySelector('.user_avatar > img');
let avatarField2 = document.querySelector('.is_avatar');
let userGeneralMean = document.querySelector('.user_name > p');

let elycoState = false;
let pronoteState = false;

let utils = new Utils(); //on crée un objet utils pour pouvoir utiliser les fonctions outils

let token = utils.getToken(); //on récupère le token stocké dans les cookies

socket.emit('join', { token: token }); //on envoie le token au websocket pour qu'il l'ajoute à la liste des utilisateurs connectés

socket.on('join', (data) => {
    if (data.status) {
        loader.remove();

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
        mainContainer.classList.remove('hide');


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
                elycoConnectInstanceCard.innerHTML = 'Connecté';
                elycoConnectInstanceCard.classList.add('text-green-500');
                elycoConnectInstanceCard.classList.remove('text-red-500');
                elycoState = true;
            } else {
                elycoConnectInstanceCard.innerHTML = 'Echec';
                elycoConnectInstanceCard.classList.add('text-red-500');
                elycoConnectInstanceCard.parentNode.parentNode.style.border = "solid 1px red";
                elycoConnectInstanceCard.parentNode.parentNode.setAttribute('uk-tooltip', 'title: Il semblerait que E-lyco soit indisponible pour le moment');
                document.querySelector('.notif-btn').remove();
                document.querySelector('.message-btn').remove();
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Mes cours') {
                        item.remove();
                    }
                });
            }
            utils.updateSidebarLoaderState(0, false);
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
                pronoteConnectInstanceCard.innerHTML = 'Connecté';
                pronoteConnectInstanceCard.classList.add('text-green-500');
                pronoteConnectInstanceCard.classList.remove('text-red-500');
                pronoteState = true;
            } else {
                pronoteConnectInstanceCard.innerHTML = 'Echec';
                pronoteConnectInstanceCard.classList.add('text-red-500');
                pronoteConnectInstanceCard.parentNode.parentNode.style.border = "solid 1px red";
                pronoteConnectInstanceCard.parentNode.parentNode.setAttribute('uk-tooltip', 'title: Il semblerait que Pronote soit indisponible pour le moment.');
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerText == 'Emplois du temps' || item.querySelector('span').innerText == 'Mes notes') {
                        item.remove();
                    }
                });
            }
            utils.updateSidebarLoaderState(1, false);
        }).catch(err => {
            console.log(err);
        });

        //######################################################################################################################
        //                                             AUTRES ACTIONS DE LA PAGE D'ACCUEIL
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
                    <div class="lg:w-full lg:px-20 space-y-7 post-container">
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
                </div>`;
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
socket.on('privatemessage', (data) => {

});

//lorsque l'utilisateur clique sur un des onglets de la sidebar, on change l'onglet actif et on cache le mainContainer
function launchPage(pageName) {
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('span').innerHTML === pageName) {
            item.classList.add('active');
            mainContainer.classList.add('hide');
        }
    });
}
let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
let noteDate = tomorrow;

function createNote(e) {
    if (e.type == 'keyup') {
        if (e.keyCode == 13) {
            if (e.target.value.length > 0) {
                fetch('./api/note/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        content: utils.escapeHTML(e.target.value),
                        date: utils.escapeHTML(noteDate)
                    })
                }).then(res => res.json()).then(data => {
                    if (data.status) {
                        e.target.value = '';
                    } else {
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

disconnectedBtn.addEventListener('click', () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    window.location.href = '/login';
});

socket.on('disconnected', () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    window.location.href = '/login';
});