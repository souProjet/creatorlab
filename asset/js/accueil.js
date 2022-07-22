var socket = io();

let disconnectedBtn = document.querySelector('.disconnected-btn');
let contactList = document.querySelector('.contact-list');
let searchBar = document.querySelector('.form-control');
let mainContainer = document.querySelector('.main_content');
let sidebarItems = document.querySelectorAll('.sidebar_inner ul li');

//fonctions outils

function createModal(msg, error = false) {
    let modal = `
    <div class="absolute bg-white rounded-lg border-gray-300 border p-3 shadow-lg" style="z-index:2000;right:2%;top:8%;">
        <div class="flex flex-row">
            <div class="px-2">
            ${error ? `
            <svg height="24" width="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <circle style="fill:#D75A4A;" cx="25" cy="25" r="25" />
                <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" points="16,34 25,25 34,16 " />
                <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" points="16,16 25,25 34,34 " />
            </svg>` : 
            `<svg width="24" height="24" viewBox="0 0 1792 1792" fill="#44C997" xmlns="http://www.w3.org/2000/svg">
                <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"></path>
            </svg>`}
            </div>
            <div class="ml-2 mr-6">
                <span class="font-semibold">${msg}</span>
            </div>
        </div>
    </div>`;
    let modalDOM = document.createElement('div');
    modalDOM.innerHTML = modal;
    document.body.insertBefore(modalDOM, document.body.firstChild);
    setTimeout(() => {
        modalDOM.remove();
    }, 3000);
}

function escapeHTML(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function calculateTimeBetweenDateAndToday(date) {
    let today = new Date();
    let dateToCompare = date;
    let timeBetween = today.getTime() - dateToCompare.getTime();
    let time = Math.floor(timeBetween / (1000 * 60 * 60));
    if (time < 1) {
        return 'Il y a ' + Math.floor(timeBetween / (1000 * 60)) + ' minutes';
    } else if (time < 24) {
        return 'Il y a ' + time + ' heures';
    } else if (time < 48) {
        return 'Il y a ' + Math.floor(time / 24) + ' jour';
    } else if (time < 24 * 30) {
        return 'Il y a ' + Math.floor(time / 24) + ' jours';
    } else if (time < 24 * 30 * 12) {
        return 'Il y a ' + Math.floor(time / (24 * 30)) + ' mois';
    } else if (time < 24 * 30 * 12 * 2) {
        return 'Il y a ' + Math.floor(time / (24 * 30 * 12)) + ' an';
    } else {
        return 'Il y a ' + Math.floor(time / (24 * 30 * 12)) + ' ans';
    }

}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}
let monthByName = {
    'janvier': 0,
    'février': 1,
    'mars': 2,
    'avril': 3,
    'mai': 4,
    'juin': 5,
    'juillet': 6,
    'août': 7,
    'septembre': 8,
    'octobre': 9,
    'novembre': 10,
    'décembre': 11
}

let token = escapeHTML(document.cookie.split('=')[1]);
let reportcard = {}
    //connexion au server et identification du client
socket.emit('joinRoom', {
    token: token
});

//partie connexion e-lyco
socket.on('userInfo', data => {
    if (data.status) {
        document.querySelector('.connection-box').remove();
        mainContainer.classList.remove('hide');

        //get reportcard
        fetch('/api/getReportcard', {
            method: 'GET',
            headers: {
                'Application-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data2 => {
            reportcard = JSON.parse(data2.reportcardJSON);
            let offset_mean = 4;
            document.querySelector('.user_name > p').style.fontSize = ".8em";
            let dist_mean = Math.round((reportcard.general_student - reportcard.general_class) * -100) / -100;
            dist_mean > offset_mean ? dist_mean = offset_mean : dist_mean < -offset_mean ? dist_mean = -offset_mean : dist_mean = dist_mean;
            let g_mean = Math.floor(((dist_mean + offset_mean) * 256 / (offset_mean * 2)) - 1);
            let r_mean = Math.floor(256 - ((dist_mean + offset_mean) * 256 / (offset_mean * 2)));
            document.querySelector('.user_name > p').style.color = "rgb(" + (r_mean) + ", " + (g_mean) + ", 0)";
            document.querySelector('.user_name > p').innerText = reportcard.general_student.toString().replace('.', ',') + ' de moyenne';


            document.querySelector('.user_name > div').innerText = data.userInfo.username;
            document.querySelector('.user_avatar > img').src = data.userInfo.avatar;
            document.querySelector('.share-field-icon-1').src = data.userInfo.avatar;
            document.querySelector('.share-field-icon-2').src = data.userInfo.avatar;
            document.querySelector('.is_avatar').src = data.userInfo.avatar;
            if (localStorage.getItem('sidebarItem') && localStorage.getItem('sidebarItem') != "Accueil") {
                sidebarItems.forEach(item => {
                    if (item.querySelector('span').innerHTML == localStorage.getItem('sidebarItem')) {
                        item.click();
                    }
                });
            } else {

                fetch('/api/getposts', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).then(res => res.json()).then(data => {
                    if (data.status) {
                        data.posts.forEach(post => {
                            let postContainer = document.querySelector('.post-container');
                            postContainer.innerHTML += `
                        <div class="card lg:mx-0 uk-animation-slide-bottom-small post" id="${post.token}">
                            <div class="flex justify-between items-center lg:p-4 p-2.5">
                                <div class="flex flex-1 items-center space-x-4">
                                    <a>
                                        <img src="${post.userInfo.avatar}" class="bg-gray-200 border border-white rounded-full w-10 h-10">
                                    </a>
                                    <div class="flex-1 font-semibold">
                                        <a class="text-black dark:text-gray-100">${post.userInfo.name}</a>
                                        <div class="text-gray-700 flex items-center space-x-2">
                                            ${calculateTimeBetweenDateAndToday(new Date(parseInt(post.created.split('-')[0]), parseInt(post.created.split('-')[1]) - 1, parseInt(post.created.split('-')[2].split(' ')[0]), parseInt(post.created.split(' ')[1].split(":")[0]), parseInt(post.created.split(":")[1])))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                ` + (post.userInfo.isYou ? `
                                <a href="#" aria-expanded="false" class="">
                                    <i class="uil-trash-alt text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-700"></i>
                                </a>
                                <div class="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 uk-drop uk-drop-bottom-right" uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small" style="left: 279.703px; top: 2.5px;">
    
                                    <ul class="space-y-1">
                                        <li>
                                            <a href onclick="deletePost(event, '${post.token}')" class="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600">
                                                <i class="uil-trash-alt mr-1"></i> Supprimer
                                            </a>
                                        </li>
                                    </ul>
    
                                </div>
                                ` : ``) + `
                            </div>
                                       
                            </div>
    
    
                            <div class="p-5 pt-0 border-b dark:border-gray-700">
                                ${post.content}
                            </div>
    
    
                            <div class="p-4 space-y-3">
    
                                <div class="flex space-x-4 lg:font-bold">
                                    <a href onclick="likePost(this, event, '${post.token}')" class="flex items-center space-x-2 ${post.likeInfo.isLiked ? 'text-blue-500' : ''}">
                                        <div class="p-2 rounded-full  text-${post.likeInfo.isLiked ? 'blue' : 'gray'} lg:bg-${post.likeInfo.isLiked ? 'blue' : 'gray'}-100 dark:bg-${post.likeInfo.isLiked ? 'blue' : 'gray'}-600 ">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                                            </svg>
                                        </div>
                                        <div>Aimer</div>
                                        <span>${post.likeInfo.nbrLikes}</span>
                                    </a>
                                    </a>
                                </div>
                            </div>
                        </div>`;

                        });
                    }

                }).catch(err => {
                    console.log(err);
                });
            }

        }).catch(err => {
            console.log(err);
        });


    } else {
        document.querySelector('.connection-box').innerHTML = `<div>Erreur lors de la connexion à e-lyco...</div>`;
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        window.location.href = '/login';
    }
});
disconnectedBtn.addEventListener('click', () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';

    window.location.href = '/login';
});

//partie notification
let notifBtn = document.querySelector('.is_icon');
let notificationBox = document.querySelector('.notification-box');

notifBtn.addEventListener('click', () => {
    if (notifBtn.getAttribute('aria-expanded') == 'false') {
        notificationBox.innerHTML = `<div class="drop_text"><p style="display:flex; justify-content:center;">Chargement...&nbsp;<img style="height:30px; width:30px;" src="./public/images/loader-waiting2.svg"></p></div>`;
        socket.emit("getNotifs", {
            token: token
        });
    }
});
let notifsBox = document.querySelectorAll('.courseNotif');

socket.on('notifs', data => {
    if (data.status) {
        if (data.notifs.length > 0) {
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



//partie message (ça va être un peu moins du gâteau)
let messageBox = document.querySelector('.message-box');
let messageBtn = document.querySelectorAll('.is_icon')[1];

function onscroll() {
    let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
    let offsetScrollMessageBox = scrollMessageBox.scrollHeight - scrollMessageBox.clientHeight
    if (scrollMessageBox.scrollTop == (scrollMessageBox.scrollHeight - scrollMessageBox.clientHeight)) {
        if (scrollMessageBox.scrollTop == offsetScrollMessageBox) {
            scrollMessageBox.setAttribute('data-page', parseInt(scrollMessageBox.getAttribute('data-page') || 0) + 1);
            scrollMessageBox.scrollTop = offsetScrollMessageBox;
            offsetScrollMessageBox = scrollMessageBox.scrollHeight - scrollMessageBox.clientHeight;
            socket.emit("getMessages", {
                token: token,
                pageIndex: parseInt(scrollMessageBox.getAttribute('data-page'))
            });
        }
    }
}

function messageBtnAction() {
    let messageBox = document.querySelector('.message-box');
    let convTitle = document.querySelectorAll('.drop_headline > h4')[1];
    convTitle.innerText = 'Messages';
    if (messageBtn.getAttribute('aria-expanded') == 'false') {
        messageBox.innerHTML = `<div class="drop_text"><p style="display:flex; justify-content:center;">Chargement...&nbsp;<img style="height:30px; width:30px;" src="./public/images/loader-waiting2.svg"></p></div>`;
        socket.emit("getMessages", {
            token: token,
            pageIndex: 0
        });
    }
    let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
    scrollMessageBox.addEventListener('scroll', onscroll);
}
messageBtn.addEventListener('click', () => {
    messageBtnAction();
});


socket.on('messages', data => {
    let messageBox = document.querySelector('.message-box');
    document.querySelector('.message-reply') ? document.querySelector('.message-reply').remove() : '';
    if (data.status) {
        if (data.messages.length > 0) {
            let messagesHTML = ``;
            data.messages.forEach(message => {
                message.participants = message.participants.filter(participant => participant.name != document.querySelector('.user_name > div').innerHTML);
                messagesHTML += `<li>
                    <a style="cursor:pointer;" class="conv" id="${message.convId}">
                        <div class="drop_avatar"><img src="` + (message.type == "Group" ? './public/images/groupe.png' : message.participants[message.participants.length - 1].avatarUrl || './public/images/defaultAvatar.png') + `" alt="">
                        </div>
                        <div class="drop_text">
                            <strong>` + (message.type == "Group" ? message.lastMessage.authorName.replace('(44-BOUAYE)', '') : message.participants[message.participants.length - 1].name) + `</strong> <time>` + (calculateTimeBetweenDateAndToday(new Date(parseInt(message.lastMessage.created.split('/')[2].split(' ')[0]), parseInt(message.lastMessage.created.split('/')[1]) - 1, parseInt(message.lastMessage.created.split('/')[0]), parseInt(message.lastMessage.created.split(' ')[1].split(":")[0]), parseInt(message.lastMessage.created.split(":")[1])))) + `</time>
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
                        socket.emit("getConv", {
                            token: token,
                            convId: conv.id,
                            pageIndex: parseInt(scrollMessageBox.getAttribute('data-page') || 0)
                        });


                    }, 300);
                });
            });
        } else {
            messageBox.innerHTML = `<div class="drop_text"><p style="display:flex; justify-content:center;">Aucun message</p></div>`;
        }
    }
});

socket.on('conv', (data) => {
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
                        <div class="message-text"><p>${replaceURLWithHTMLLinks(message.text)} ` + (message.attachmentUrl ? '<a href="' + message.attachmentUrl + '">' + message.attachmentName + '</a>' : '') + `</p></div>
                    </div>
                    <div class="clearfix"></div>
                </div>`;
                if (i == conv.messages.length - 1) {
                    convHTML += `
                    <div class="message-time-sign">
                        <span>` + (calculateTimeBetweenDateAndToday(new Date(parseInt(message.created.split('/')[2].split(' ')[0]), parseInt(message.created.split('/')[1]) - 1, parseInt(message.created.split('/')[0]), parseInt(message.created.split(' ')[1].split(":")[0]), parseInt(message.created.split(":")[1])))) + `</span>
                    </div>`;

                }
            }

            messageBox.innerHTML = convHTML;
            if (!conv.readOnly) {
                document.querySelectorAll('.header_dropdown')[1].innerHTML += `
                <!-- Reply Area -->
                <div class="message-reply">
                    <img src="./public/images/attachement.png" alt="" class="h-7 w-7 self-center mr-2 cursor-pointer">
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
                        socket.emit('sendMessage', {
                            token: token,
                            convId: messageBox.id,
                            text: escapeHTML(message)
                        });
                        document.querySelector('.message-reply > textarea').value = '';
                        messageBox = document.querySelector('.message-box');
                        document.querySelector('.message-time-sign').remove();
                        messageBox.innerHTML += `
                        <div class="message-bubble me" id="${messageBox.id}">
                            <div class="message-bubble-inner">
                                <div class="message-avatar"><img src="${document.querySelector('.is_avatar').src}" alt=""></div>
                                <div class="message-text"><p>${replaceURLWithHTMLLinks(message)}</p></div>
                            </div>
                            <div class="clearfix"></div>
                        </div>`;
                        let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
                        scrollMessageBox.scrollTop = scrollMessageBox.scrollHeight;
                        document.querySelectorAll('.erreur-msg-chat').forEach(element => {
                            element.remove();
                        });
                    }
                });

                document.querySelector('.message-reply > img').addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector('.message-reply > input').click();
                });

                document.querySelector('.message-reply > input').addEventListener('change', (e) => {
                    e.preventDefault();
                    let files = e.target.files;
                    if (files) {
                        const formData = new FormData();
                        formData.append('fileAttachment', files[0]);
                        fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Destination': 'elyco',
                            },
                            body: formData

                        }).then(res => res.json()).then(data => {
                            if (data) {
                                if (data.status) {

                                    document.querySelectorAll('.erreur-msg-chat').forEach(element => {
                                        element.remove();
                                    });
                                }
                                // socket.emit('sendMessage', {
                                //     token: token,
                                //     convId: messageBox.id,
                                //     text: '',
                                //     attachmentUrl: data.url,
                                //     attachmentName: file.name
                                // });
                                // messageBox = document.querySelector('.message-box');
                                // document.querySelector('.message-time-sign').remove();
                                // messageBox.innerHTML += `
                                //     <div class="message-bubble me" id="${messageBox.id}">

                                //         <div class="message-bubble-inner">
                                //             <div class="message-avatar"><img src="${document.querySelector('.is_avatar').src}" alt=""></div>
                                //             <div class="message-text"><p>${replaceURLWithHTMLLinks(file.name)}</p></div>
                                //         </div>
                                //         <div class="clearfix"></div>
                                //     </div>`;
                                // let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
                                // scrollMessageBox.scrollTop = scrollMessageBox.scrollHeight;
                            } else {
                                document.querySelector('.message-reply').innerHTML += '<p class="text-red-500 text-center erreur-msg-chat">Erreur lors de l\'envoie du fichier</p>';
                            }
                            document.querySelector('.message-reply > input').value = '';
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                });
            }

            let scrollMessageBox = document.querySelectorAll('.header_dropdown .simplebar-content')[1];
            scrollMessageBox.scrollTop = scrollMessageBox.scrollHeight;

        }
    }
    let backMessageElement = document.querySelector('.back-message');

    backMessageElement.addEventListener('click', (e) => {
        e.preventDefault();
        messageBtnAction();
    });
});

function viewprofile(id, avatar, name, readOnly) {
    if (!readOnly) {
        mainContainer.classList.add('hide');
        socket.emit('getProfile', {
            token: token,
            id: id,
            avatar: avatar,
            name: name
        });
    }
}

socket.on('unseen', (data) => {
    if (data.nbrUnSeenNotif != 0) {
        document.querySelector('.notif-count') ? document.querySelector('.notif-count').innerHTML = data.nbrUnSeenNotif : document.querySelector('.notif-btn').innerHTML += `<span class="notif-count">${data.nbrUnSeenNotif}</span>`;
    }
    if (data.nbrUnSeenMessage != 0) {
        document.querySelector('.message-count') ? document.querySelector('.message-count').innerHTML = data.nbrUnSeenMessage : document.querySelector('.message-btn').innerHTML += `<span class="notif-count">${data.nbrUnSeenMessage}</span>`;
    }
});
sidebarItems.forEach(sidebarItem => {
    sidebarItem.addEventListener('click', (e) => {
        document.querySelector('.main_content .mcontainer').style.height = '';
        localStorage.setItem('sidebarItem', sidebarItem.querySelector('span').innerHTML);
        mainContainer.classList.add('hide');
        if (sidebarItem.querySelector('span').innerHTML == 'Accueil') {
            //window.location.href = "/";
        } else {
            sidebarItems.forEach(sidebarItem => sidebarItem.classList.remove('active'));
            sidebarItem.classList.add('active');
        }
    });
});

let shareFieldTextarea = document.querySelector('.share-field-textarea');
let shareButton = document.querySelector('.share-button');
let shareFieldAddImage = document.querySelector('.share-field-addimage');
let inputFileImageShareField = document.querySelector('.input-file-image-share-field');
let shareFieldImageBox = document.querySelector('.share-field-image-box');
shareButton.addEventListener('click', (e) => {
    e.preventDefault();
});

// shareFieldAddImage.addEventListener('click', (e) => {
//     e.preventDefault();
//     inputFileImageShareField.click();
// });

// inputFileImageShareField.addEventListener('change', (e) => {
//     e.preventDefault();
//     let files = e.target.files;
//     let acceptedFiles = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml', 'image/tiff'];
//     shareFieldImageBox.innerHTML = '';
//     if (files) {
//         for (let i = 0; i < files.length; i++) {
//             if (acceptedFiles.indexOf(files[i].type) != -1) {
//                 shareFieldImageBox.innerHTML += `<div class="share-field-image-box-item" title="${files[i].name}"><img src="${URL.createObjectURL(files[i])}" alt=""></div>`;
//             }

//         }
//     }
// });



shareButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (shareFieldTextarea.value != '') {
        let formData = new FormData();
        formData.append('text', shareFieldTextarea.value);
        //formData.append('nbrImages', inputFileImageShareField.files.length);
        // for (let i = 0; i < inputFileImageShareField.files.length; i++) {
        //     formData.append('image' + i, inputFileImageShareField.files[i]);
        // }
        fetch('/api/share', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(res => res.json())
            .then(res => {
                if (res.status) {

                    postContainer = document.querySelector('.post-container');
                    let postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.classList.add('lg:mx-0');
                    postElement.classList.add('uk-animation-slide-bottom-small');
                    postElement.classList.add('card');

                    postElement.innerHTML = `
                <div class="card lg:mx-0 uk-animation-slide-bottom-small" id="${res.token}">
                <div class="flex justify-between items-center lg:p-4 p-2.5">
                    <div class="flex flex-1 items-center space-x-4">
                        <a>
                            <img src="${document.querySelector('.is_avatar').src}" class="bg-gray-200 border border-white rounded-full w-10 h-10">
                        </a>
                        <div class="flex-1 font-semibold capitalize">
                            <a class="text-black dark:text-gray-100">${document.querySelector('.user_name').innerText.split('\n')[1].trim()}</a>
                            <div class="text-gray-700 flex items-center space-x-2">
                                à l'instant
                            </div>
                        </div>
                    </div>

                    <a href="#" aria-expanded="false" class="">
                    <i class="uil-trash-alt text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-700"></i>
                </a>
                <div class="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 uk-drop uk-drop-bottom-right" uk-drop="mode: click;pos: bottom-right;animation: uk-animation-slide-bottom-small" style="left: 279.703px; top: 2.5px;">

                    <ul class="space-y-1">
                        <li>
                            <a href onclick="deletePost(event, '${res.token}')" class="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600">
                                <i class="uil-trash-alt mr-1"></i> Supprimer
                            </a>
                        </li>
                    </ul>

                </div>
                </div>
                <div class="p-5 pt-0 border-b dark:border-gray-700">
                    ${shareFieldTextarea.value}
                </div>


                <div class="p-4 space-y-3">

                    <div class="flex space-x-4 lg:font-bold">
                        <a href onclick="likePost(this, event, '${res.token}')"  class="flex items-center space-x-2">
                            <div class="p-2 rounded-full  text-black lg:bg-gray-100 dark:bg-gray-600 ">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                                </svg>
                            </div>
                            <div>Aimer</div>
                        </a>
                        </a>
                    </div>
                </div>
            </div>`;
                    document.querySelector('.card').parentNode.insertBefore(postElement, document.querySelector('.post'));
                    shareFieldTextarea.value = '';
                    //shareFieldImageBox.innerHTML = '';
                    document.querySelector('.uk-close').click()
                }
            }).catch(err => {
                console.log(err);
            });
    }
});

function deletePost(e, postToken) {
    e.preventDefault();
    fetch('/api/deletepost', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postToken: postToken
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                document.getElementById(postToken).remove();
            }
        }).catch(err => {
            console.log(err);
        });
}

function likePost(element, e, postToken) {
    e.preventDefault();
    fetch('/api/likepost', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postToken: postToken
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                if (element.classList.contains('text-blue-500')) {
                    element.classList.remove('text-blue-500');
                    element.querySelector('span').innerText = parseInt(element.querySelector('span').innerText) - 1;
                } else {
                    element.classList.add('text-blue-500');
                    element.querySelector('span').innerText = parseInt(element.querySelector('span').innerText) + 1;
                }
            }
        }).catch(err => {
            console.log(err);
        });

}
socket.on('disconnected', () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    window.location.href = '/login';
});