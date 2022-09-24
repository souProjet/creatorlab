let sidebarItemCloud;
sidebarItems.forEach((item) => {
    if (item.querySelector('span').innerHTML === 'Mon cloud') {
        sidebarItemCloud = item;
    }
});

let contextFolderState = false;
let main;
let headerPath;
let flagDraggedState = false;

function initcloudApp() {
    mainContent.innerHTML = `
    <div class="app-cloud" style="height:calc(100vh - 65px - 30px);">
        <input type="file" multiple class="hidden file-input-upload-cloud" onchange="fileDropedCloud(event)">
        <div class="header-cloud">
            <h1><span onclick="enterInFolder()" class="title-for-cloud">Accueil</span></h1>
        </div>
        <div class="mail-icons">
            <svg uk-tooltip="title: Créer un dossier" onclick="createFolder();" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5H7v-1H1.99V6h4.49l.35-.15.86-.86H14v1.5l-.001.51h1.011V2.5L14.5 2zm-.51 2h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99zM13 16h-1v-3H9v-1h3V9h1v3h3v1h-3v3z" />
            </svg>
            <svg uk-tooltip="title: Créer un fichier texte" onclick="createFile();" width="24" height="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 275.836 275.836" style="enable-background:new 0 0 275.836 275.836;" xml:space="preserve">
                <g fill="blue">
                    <path d="M191.344,20.922l-95.155,95.155c-0.756,0.756-1.297,1.699-1.565,2.734l-8.167,31.454c-0.534,2.059,0.061,4.246,1.565,5.751
                    c1.14,1.139,2.671,1.757,4.242,1.757c0.503,0,1.009-0.063,1.508-0.192l31.454-8.168c1.035-0.269,1.979-0.81,2.734-1.565
                    l95.153-95.153c0.002-0.002,0.004-0.003,0.005-0.004s0.003-0.004,0.004-0.005l19.156-19.156c2.344-2.343,2.344-6.142,0.001-8.484
                    L218.994,1.758C217.868,0.632,216.343,0,214.751,0c-1.591,0-3.117,0.632-4.242,1.758l-19.155,19.155
                    c-0.002,0.002-0.004,0.003-0.005,0.004S191.346,20.921,191.344,20.922z M120.631,138.208l-19.993,5.192l5.191-19.993l89.762-89.762
                    l14.801,14.802L120.631,138.208z M214.751,14.485l14.801,14.802l-10.675,10.675L204.076,25.16L214.751,14.485z" />
                    <path d="M238.037,65.022c-3.313,0-6,2.687-6,6v192.813H43.799V34.417h111.063c3.313,0,6-2.687,6-6s-2.687-6-6-6H37.799
                    c-3.313,0-6,2.687-6,6v241.419c0,3.313,2.687,6,6,6h200.238c3.313,0,6-2.687,6-6V71.022
                    C244.037,67.709,241.351,65.022,238.037,65.022z" />
                </g>
            </svg>
            <svg uk-tooltip="title: Upload un fichier" onclick="document.querySelector('.file-input-upload-cloud').click();" width="24" height="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 384.97 384.97" style="enable-background:new 0 0 384.97 384.97;" xml:space="preserve">
                <g fill="blue">
                    <g id="Upload">
                        <path d="M372.939,264.641c-6.641,0-12.03,5.39-12.03,12.03v84.212H24.061v-84.212c0-6.641-5.39-12.03-12.03-12.03
                        S0,270.031,0,276.671v96.242c0,6.641,5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03v-96.242
                        C384.97,270.019,379.58,264.641,372.939,264.641z" />
                        <path d="M117.067,103.507l63.46-62.558v235.71c0,6.641,5.438,12.03,12.151,12.03c6.713,0,12.151-5.39,12.151-12.03V40.95
                        l63.46,62.558c4.74,4.704,12.439,4.704,17.179,0c4.74-4.704,4.752-12.319,0-17.011l-84.2-82.997
                        c-4.692-4.656-12.584-4.608-17.191,0L99.888,86.496c-4.752,4.704-4.74,12.319,0,17.011
                        C104.628,108.211,112.327,108.211,117.067,103.507z" />
                    </g>
                </g>
            </svg>
        </div>
        <main class="main-cloud" uk-lightbox>
        </main>
    </div>`;
    main = document.querySelector('main.main-cloud')
    headerPath = document.querySelector('div.header-cloud > h1')

    enterInFolder();
    mainContent.style.height = 'calc(100vh - 65px)';
    mainContainer.classList.remove('hide');

    document.querySelector('.app-cloud').addEventListener('contextmenu', (e) => {
        if (!contextFolderState) {
            e.preventDefault();
            document.querySelectorAll('.contextmenu').forEach(menu => menu.remove());
            let contextmenu = document.createElement('div');
            contextmenu.classList.add('contextmenu');
            contextmenu.innerHTML = `
                <div class="contextmenu_item" onclick="createFolder()">Créer un dossier</div>
                <div class="contextmenu_item" onclick="createFile()">Créer un fichier texte</div>
                <div class="contextmenu_item" onclick="document.querySelector('.file-input-upload-cloud').click()">Upload un fichier</div>
            `;
            contextmenu.style.top = e.pageY + 'px';
            contextmenu.style.left = e.pageX + 'px';
            mainContent.appendChild(contextmenu);
        }
    });
    document.querySelector('.app-cloud').addEventListener('click', () => {
        clearContextMenu();
    });
    document.querySelector('.app-cloud').addEventListener('dbclick', () => {
        clearContextMenu();
    });

    document.querySelector('.app-cloud').addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!flagDraggedState) {
            document.querySelector('.main-cloud').style.backgroundImage = 'url(/public/images/dropfile.png)';
        }

    });
    document.querySelector('.app-cloud').addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    document.querySelector('.app-cloud').addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    document.querySelector('.app-cloud').addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!flagDraggedState) {
            document.querySelector('.main-cloud').style.backgroundImage = 'none';
            fileDropedCloud(e);
        }
    });

}

sidebarItemCloud.addEventListener('click', function() {
    initcloudApp();
});

function clearContextMenu() {
    document.querySelectorAll('.contextmenu').forEach(menu => menu.remove());
    contextFolderState = false;
}


async function enterInFolder(path, reload = false) {
    let parentFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    if (((parentFolderPath != path) || !path) || reload) {
        main.innerHTML = ``;
        headerPath.innerHTML = `<span onclick="enterInFolder()" class="title-for-cloud">Accueil</span>`

        const response = await fetch('/api/cloud/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                filter: false
            })
        });
        let data = await response.json();

        if (data.status) {
            let file = data.data;
            if (path) {
                let actualId = path;
                while (actualId != null) {
                    let newHeaderPlus = new DOMParser().parseFromString(`<i class="material-icons arrow-for-cloud">arrow_forward_ios</i><span class="nav-item-for-cloud" onclick="enterInFolder('${actualId}')">${file.filter(f => f.id == actualId)[0].name}</span>`, 'text/html');
                    let newHeaderPlusFirstChild = newHeaderPlus.body.firstChild;
                    let newHeaderPlusLastChild = newHeaderPlus.body.lastChild;
                    let dernHeader = document.querySelector('.arrow-for-cloud');
                    let parentHeader = dernHeader ? dernHeader.parentNode : document.querySelector('.title-for-cloud').parentNode
                    parentHeader.insertBefore(newHeaderPlusFirstChild, dernHeader);
                    parentHeader.insertBefore(newHeaderPlusLastChild, dernHeader);
                    actualId = file.filter(f => f.id == actualId)[0].parent;
                }
            }

            firstFile = file.filter(fileItem => fileItem.parent == (path ? path : null));
            let folders = firstFile.filter(fileItem => fileItem.type == "folder");
            let files = firstFile.filter(fileItem => fileItem.type == "file");

            for (let i = 0; i < folders.length; i++) {
                main.innerHTML +=
                    `<div draggable="true" id="${folders[i].id}" type="${folders[i].type}" class="folder" onclick="enterInFolder('${folders[i].id}')">
                    <i  class="material-icons">folder</i>
                    <p class="cooltip">${file.filter(fileItem => fileItem.type == "folder").filter(fileItem => fileItem.parent == folders[i].id).length} folder${(file.filter(fileItem => fileItem.type == "folder").filter(fileItem => fileItem.parent == folders[i].id).length > 1) ? `s` : ``} / ${file.filter(fileItem => fileItem.type == "file").filter(fileItem => fileItem.parent == folders[i].id).length} file${(file.filter(fileItem => fileItem.type == "file").filter(fileItem => fileItem.parent == folders[i].id).length > 1) ? `s` : ``}</p>

                    <h1>${folders[i].name}</h1>
                </div>`;
            }
            for (let i = 0; i < files.length; i++) {
                main.innerHTML +=
                `<div draggable="true" id="${files[i].id}" type="${files[i].type}" isuploadedfile="${files[i].isUploadedFile}" class="folder" onclick="enterInEditor('${files[i].id}', '${files[i].parent}')">
                    <i class="material-icons">description</i>
                    <p class="cooltip">${utils.octetToString(files[i].size) || "non défini"}</p>
                    <h1>${files[i].name}</h1>
                </div>`;
                // main.innerHTML +=
                // `<a id="${files[i].id}" type="${files[i].type}" isuploadedfile="${files[i].isUploadedFile}" class="folder" `+(files[i].isUploadedFile ? `href="/storage/${token}/${files[i].id}/${files[i].name.split('.')[files[i].name.split('.').length-1]}"` : `onclick="enterInEditor('${files[i].id}', '${files[i].parent}')"`)+` data-caption="${files[i].name}">
                //     <i class="material-icons">description</i>
                //     <p class="cooltip">${utils.octetToString(files[i].size) || "non défini"}</p>
                //     <h1>${files[i].name}</h1>
                // </a>`;

                if(!files[i].isUploadedFile) {    
                    fetch('/api/cloud/getthumbnail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({
                            fileId: files[i].id
                        })
                    }).then(response => response.json()).then(data => {
                        if (data.status) {
                            let thumbnailElement = document.getElementById(files[i].id).querySelector('.material-icons');

                            let thumbnailB64 = data.thumbnail;
                            let thumbnailBlob = utils.b64toBlob(thumbnailB64, 'image/png');
                            let thumbnailUrl = URL.createObjectURL(thumbnailBlob);
                            thumbnailElement.innerHTML = '';
                            thumbnailElement.style.backgroundImage = `url(${thumbnailUrl})`;
                            thumbnailElement.style.backgroundSize = 'cover';
                            thumbnailElement.style.borderTop = 'solid 1px lightgray';
                            thumbnailElement.style.borderLeft = 'solid 1px lightgray';
                            thumbnailElement.style.borderRight = 'solid 1px lightgray';
                            thumbnailElement.style.borderTopLeftRadius = '20px';
                            thumbnailElement.style.borderTopRightRadius = '10px';

                        }else{
                            console.log(data.message);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            }
    
            document.querySelectorAll('.folder').forEach(folder => {
                folder.addEventListener('contextmenu', (e) => {
                    contextFolderState = true;
                    e.preventDefault();
                    document.querySelectorAll('.contextmenu').forEach(menu => menu.remove());
                    let contextmenu = document.createElement('div');
                    contextmenu.classList.add('contextmenu');
                    contextmenu.innerHTML = `
                    <div class="contextmenu_item" onclick="${folder.getAttribute('onclick')}; clearContextMenu()">Ouvrir</div>
                    <div class="contextmenu_item" onclick="rename('${folder.id}', '${folder.getAttribute('type')}')">Renommer</div>
                    <div class="contextmenu_item" onclick="deleteElement('${folder.id}', '${folder.getAttribute('type')}')">Supprimer</div>
                    `+(folder.getAttribute('type') == 'file' && folder.getAttribute('isuploadedfile') == "true" ? `<div class="contextmenu_item" onclick="downloadFile('${folder.id}')">Télécharger</div>` : ``)+`
                    `;
                    contextmenu.style.top = e.pageY + 'px';
                    contextmenu.style.left = e.pageX + 'px';
                    mainContent.appendChild(contextmenu);
                });

                folder.addEventListener('drag', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    flagDraggedState = true;
                    e.target.style.opacity="0";
                });
                folder.addEventListener('dragend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    flagDraggedState = false;

                    document.querySelectorAll('.folder').forEach(f => {
                        if(f.getAttribute('type') == 'folder'){
                            if(f.querySelector('i').innerText == 'folder_open'){
                                fetch('/api/cloud/move', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + token
                                    },
                                    body:JSON.stringify({
                                        target:e.target.id,
                                        newparent: f.id
                                    })
                                }).then(res => res.json())
                                .then(res => {
                                    if(res.status){
                                        e.target.remove();
                                        f.querySelector('i').innerText = "folder";
                                    }
                                })
                            }
                        }
                    });
                    if(document.querySelector('.title-for-cloud').style.color=='green'){
                        fetch('/api/cloud/move', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body:JSON.stringify({
                                target:e.target.id,
                                newparent: null
                            })
                        }).then(res => res.json())
                        .then(res => {
                            if(res.status){
                                e.target.remove();
                                document.querySelector('.title-for-cloud').style.color='black'
                            }
                        })
                    }
                    document.querySelectorAll('.nav-item-for-cloud').forEach(nav => {
                        if(nav.style.color=='green'){
                            fetch('/api/cloud/move', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body:JSON.stringify({
                                    target:e.target.id,
                                    newparent: nav.getAttribute('onclick').split('\'')[1]
                                })
                            }).then(res => res.json())
                            .then(res => {
                                if(res.status){
                                    e.target.remove();
                                    nav.style.color='black'
                                }
                            })
                        }
                    });
                    e.target.style.opacity="1";
                })
                if(folder.getAttribute('type') == 'folder'){
                    folder.querySelector('i').addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.innerText = "folder_open";  
                    });
                    folder.querySelector('i').addEventListener('dragleave', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.innerText = "folder"
                    })
                }

                document.querySelector('.title-for-cloud').addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.target.style.color="green";
                });
                document.querySelector('.title-for-cloud').addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.target.style.color="black";
                })

                document.querySelectorAll('.nav-item-for-cloud').forEach(nav => {
                    nav.addEventListener('dragover', e => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.style.color="green";
                    });
                    nav.addEventListener('dragleave', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.style.color="black";
                    })
                })
            });
        }else{
            console.log(data.message)
        }
    }
}

let inDlOrAction = false;

function downloadFile(fileId){
    inDlOrAction = true;
    let ext = document.getElementById(fileId) ? document.getElementById(fileId).querySelector('h1').innerHTML.split('.').length > 1 ? (document.getElementById(fileId).querySelector('h1').innerHTML.split('.')[document.getElementById(fileId).querySelector('h1').innerHTML.split('.').length - 1]) : null : null
    let url = '/storage/'+token+'/'+fileId+'/'+ext;
    let link = document.querySelector('a');
    link.href = url;
    link.download = document.querySelector('#'+fileId + ' h1').innerText;
    link.click();
    inDlOrAction = false;
}
function enterInEditor(fileId, parentFolderId){
    mainContent.id = "editorjs";

    let isUploadedFile = JSON.parse(document.getElementById(fileId) ? document.getElementById(fileId).getAttribute('isuploadedfile') : false);
    if(isUploadedFile){
        let ext = document.getElementById(fileId) ? document.getElementById(fileId).querySelector('h1').innerHTML.split('.').length > 1 ? (document.getElementById(fileId).querySelector('h1').innerHTML.split('.')[document.getElementById(fileId).querySelector('h1').innerHTML.split('.').length - 1]) : null : null;
        let url = '/storage/'+token+'/'+fileId+'/'+ext;

        let acceptedExtensionsImages = ['png', 'jpg', 'jpeg', 'gif'];
        let acceptedExtensionsVideos = ['mp4', 'webm', 'ogg'];
        let acceptedExtensionsAudios = ['mp3', 'wav', 'ogg'];

        if(!inDlOrAction){
            if(acceptedExtensionsImages.includes(ext)){
                inDlOrAction = true;
                document.body.insertAdjacentHTML('afterbegin',  `
                    <div class="uk-lightbox uk-overflow-hidden uk-lightbox-panel uk-open uk-active uk-transition-active visualisator-cloud">
                        <ul class="uk-lightbox-items">
                            <li class="uk-active uk-transition-active">
                                <img width="1800" height="1200" src="${url}" alt="">
                            </li>
                        </ul> 
                        <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque">
                            <button class="uk-lightbox-toolbar-icon uk-close-large uk-icon uk-close" type="button" uk-close="" onclick="closeMedia(this)">
                                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="close-large">
                                    <line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"></line>
                                    <line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"></line>
                                </svg>
                            </button>   
                        </div>
                        <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque">
                            ${document.querySelector('#'+fileId + ' h1').innerText}
                        </div>
                    </div>`);


            }else if(acceptedExtensionsVideos.includes(ext)){
                inDlOrAction = true;
                document.body.insertAdjacentHTML('afterbegin',  `
                <div class="uk-lightbox uk-overflow-hidden uk-lightbox-panel uk-open uk-active uk-transition-active visualisator-cloud">
                    <ul class="uk-lightbox-items">
                        <li class="uk-active uk-transition-active">
                            <video autoplay controls="" playsinline="" uk-video="false" src="${url}" width="1920" height="1080"></video>
                        </li>
                    </ul> 
                    <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque">
                        <button class="uk-lightbox-toolbar-icon uk-close-large uk-icon uk-close" type="button" uk-close="" onclick="closeMedia(this)">
                            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="close-large">
                                <line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"></line>
                                <line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"></line>
                            </svg>
                        </button>   
                    </div>
                    <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque">
                        ${document.querySelector('#'+fileId + ' h1').innerText}
                    </div>
                </div>`);
                       
            } else if(acceptedExtensionsAudios.includes(ext)){ 
                document.body.insertAdjacentHTML('afterbegin',  `
                <div class="uk-lightbox uk-overflow-hidden uk-lightbox-panel uk-open uk-active uk-transition-active visualisator-cloud">
                    <ul class="uk-lightbox-items">
                        <li class="uk-active uk-transition-active">
                            <video autoplay controls="" playsinline="" uk-video="false" src="${url}" width="1920" height="1080"></video>
                        </li>
                    </ul> 
                    <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque">
                        <button class="uk-lightbox-toolbar-icon uk-close-large uk-icon uk-close" type="button" uk-close="" onclick="closeMedia(this)">
                            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="close-large">
                                <line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"></line>
                                <line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"></line>
                            </svg>
                        </button>   
                    </div>
                    <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque">
                        ${document.querySelector('#'+fileId + ' h1').innerText}
                    </div>
                </div>`);

            } else{
                utils.createModal('Creatorlab ne peut pas encore lire ce type de fichier, mais vous pouvez le télécharger.', true);
            }
        }
    }else {
        fetch('/api/cloud/getfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                fileId: fileId
            })
        })
        .then(response => response.json())
        .then(file => {
            if(file.status){
                file = file.file;
                let countDown;
                let issave = true;
                mainContent.innerHTML = `<img class="pr-10 back-fileeditor-btn" title="Quitter et Enregistrer" style="height:40px;cursor:pointer;" src="./public/images/back.svg"><h1 class="text-3xl font-semibold text-center filename-cloud" contenteditable="true">${file.name}</h1>`;
                document.querySelector('.filename-cloud').addEventListener('keydown', (e) => {
                    if(countDown){
                        clearTimeout(countDown);
                        issave = false;
                    }
                    countDown2 = setTimeout(() => {
                        issave = true;
                        fetch('/api/cloud/rename', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({
                                id: fileId,
                                newName: document.querySelector('.filename-cloud').innerText,
                                isFile: true,
                                isUploadedFile:false
                            })
                        }).then(response => response.json()).then(data => {
                            if (data.status) {
                                issave = true;
                            }else{
                                issave = false;
                                console.log(data.message);
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }, 2000);
                });

                editor = new EditorJS({
                    holderId: 'editorjs',
                    autosave: {
                        enabled: true,
                        uniqueId: 'editorjs',
                        delay: 1000,
                    },
                    tools: {
                        header: {
                            class: Header,
                            inlineToolbar: ['link']
                        },
                        list: {
                            class: List,
                            inlineToolbar: ['link']
                        },
                        // image: {
                        //     class: ImageTool,
                        //     config: {
                        //         endpoints: {
                        //             byFile: '/api/cloud/uploadFile',
                        //             byUrl: '/api/cloud/uploadUrl'
                        //         }
                        //     }
                        // },
                        embed: {
                            class: Embed,
                            config: {
                                services: {
                                    youtube: true,
                                    coub: true,
                                    soundcloud: true
                                }
                            }
                        },
                        table: {
                            class: Table,
                            inlineToolbar: ['link']
                        },
                        quote: {
                            class: Quote,
                            inlineToolbar: ['link']
                        },
                        marker: {
                            class: Marker,
                            inlineToolbar: ['link']
                        },
                        code: {
                            class: CodeTool,
                            inlineToolbar: ['link']
                        },
                        delimiter: {
                            class: Delimiter,
                            inlineToolbar: ['link']
                        },
                        inlineCode: {
                            class: InlineCode,
                            inlineToolbar: ['link']
                        },
                        linkTool: {
                            class: LinkTool,
                            inlineToolbar: ['link']
                        },
                        paragraph: {
                            class: Paragraph,
                            inlineToolbar: ['link']
                        },
                        warning: {
                            class: Warning,
                            inlineToolbar: ['link']
                        }
                    },
                    data: file.content,
                    onReady: function () {

                    },
                    onChange: function () {
                        if(countDown){
                            issave = false;
                            clearTimeout(countDown);
                        }
                        countDown = setTimeout(() => {
                            editor.save().then((savedData) => {
                                fetch('/api/cloud/savefile', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + token
                                    },
                                    body: JSON.stringify({
                                        fileId: fileId,
                                        content: savedData
                                    })
                                })
                                .then(response => response.json()).then(data => {
                                    if (data.status) {
                                        issave = true;
                                    }else{
                                        issave = false;
                                        console.log(data.message);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                });
                                (async () => {
                                    let thumbnail = await utils.domToPng(document.querySelector('.codex-editor'));
                                    fetch('/api/cloud/uploadthumbnail', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': 'Bearer ' + token
                                        },
                                        body: JSON.stringify({
                                            file: thumbnail,
                                            fileId: fileId
                                        })
                                    }).then(response => response.json()).then(data => {
                                        if (!data.status) {
                                            console.log(data.message);
                                        }
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                })();


                            }).catch((error) => {
                                console.log(error);
                            });
                        }, 2000);
                    },
                    autofocus: true,
                    placeholder: 'Veuillez entrer votre texte ici',
                });
                document.querySelector('.back-fileeditor-btn').addEventListener('click', () => {
                    if(issave){
                        mainContent.removeAttribute('id');
                        mainContent.innerHTML = '';
                        initcloudApp();
                        if(parentFolderId != "null"){
                            setTimeout(() => {
                                enterInFolder(parentFolderId);
                            }, 100);
                        }
                    }else{
                        alert('Attendez 2 secondes le temps de l\'enregistrement');
                    }

                });
            } else{
                utils.createModal('Ce fichier n\'existe pas', true);
            }
        
        });
    }

}

function closeMedia(element){
    element.parentNode.parentNode.remove();
    inDlOrAction = false;
}

function createFolder() {
    clearContextMenu();
    let createFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    fetch('/api/cloud/createfolder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            path: createFolderPath
        })
    }).then(response => response.json()).then(data => {
        if (data.status) {
            enterInFolder(createFolderPath, true);
        }else{
            console.log(data.message);
        }
    }).catch(error => {
        console.log(error);
    });
}

function createFile() {
    clearContextMenu();
    let createFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    fetch('/api/cloud/createfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            parentId: createFolderPath
        })
    }).then(response => response.json()).then(data => {
        if (data.status) {
            enterInEditor(data.fileId, createFolderPath);
        }else{
            console.log(data.message);
        }
    }).catch(error => {
        console.log(error);
    });
}

function deleteElement(id, type) {
    clearContextMenu();
    let parentFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    let nbrFolder = 0;
    let nbrFile = 0;
    if(type == "folder"){
        let elementCooltip = document.getElementById(id).querySelector('p.cooltip').innerText.split('/');
        nbrFolder = parseInt(elementCooltip[0].trim().split(' ')[0].trim());
        nbrFile = parseInt(elementCooltip[1].trim().split(' ')[0].trim());
    }
    if(nbrFolder == 0 && nbrFile == 0){
        fetch('/api/cloud/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                id: id,
                isFile: (type == "file" ? true : false),
                isUploadedFile: (type == "file" ? document.getElementById(id).getAttribute('isuploadedfile') : null),
                ext: (type == "file" ? document.getElementById(id).querySelector('h1').innerText.split('.')[document.getElementById(id).querySelector('h1').innerText.split('.').length - 1] : null)
            })
        }).then(response => response.json()).then(data => {
            if (data.status) {
                enterInFolder(parentFolderPath, true);
            }else{
                console.log(data.message);
            }
        }).catch(error => {
            console.log(error);
        });
    }else{
        utils.createModal("Cet élément contient des fichiers, vous devez les supprimer avant de pouvoir supprimer cet élément", true);
    }
}

function rename(id, type) {
    clearContextMenu();
    let activeFolder = document.getElementById(id);
    activeFolder.querySelector('h1').setAttribute('contenteditable', 'true');
    activeFolder.querySelector('h1').focus();
    activeFolder.classList.add('renaming');
    activeFolder.querySelector('h1').addEventListener('keydown', (e) => {
        if (e.code == 'Enter') {
            activeFolder.querySelector('h1').removeAttribute('contenteditable');
            activeFolder.classList.remove('renaming');
            let newName = activeFolder.querySelector('h1').innerHTML;
            if(newName != '' ){
                let parentFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
                fetch('/api/cloud/rename', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        id: id,
                        newName: newName,
                        isFile: (type == "file" ? true : false),
                        isUploadedFile: (type == "file" ? document.getElementById(id).getAttribute('isuploadedfile') : null),
                    })
                }).then(response => response.json()).then(data => {
                    if (data.status) {
                        enterInFolder(parentFolderPath, true);
                    }else{
                        console.log(data.message);
                    }
                }
                ).catch(error => {
                    console.log(error);
                });
            }

        }
    });
}



function fileDropedCloud(e) {
    let files = e.target.files || e.dataTransfer.files;
    let parentFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    let formData = new FormData();
    formData.append('parentId', parentFolderPath);
    formData.append('nbrFiles', files.length);
    for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i]);
    }
    fetch('/api/cloud/upload', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    }).then(response => response.json()).then(data => {
        if (data.status) {
            document.querySelector('.file-input-upload-cloud').value = '';
            utils.createModal("Fichier uploadé");
        }else{
            utils.createModal(data.message, true);
        }
        enterInFolder(parentFolderPath, true);
    }).catch(error => {
        console.log(error);
    });
}