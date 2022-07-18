mainContent = document.querySelector('.main_content .mcontainer');
let sidebarItemCloud = document.querySelector('.sidebar_inner ul li:nth-child(3)');
let contextFolderState = false;
let main;
let headerPath;

function initcloudApp() {
    mainContent.innerHTML = `
    <div class="app-cloud" style="height:calc(100vh - 65px - 30px);">
        <input type="file" multiple class="hidden file-input-upload-cloud" onchange="fileDropedCloud(event)">
        <div class="header-cloud">
            <h1><span onclick="enterInFolder()" class="title-for-cloud">Accueil</span></h1>
        </div>

        <main class="main-cloud" >
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
                <div class="contextmenu_item" onclick="createFolder()">Crée un dossier</div>
                <div class="contextmenu_item" onclick="createFile()">Crée un fichier texte</div>
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
        document.querySelector('.main-cloud').innerHTML += `
        <div type="file" class="folder file-drag-and-drop">
            <i class="material-icons">description</i>
        </div>`;
    });
    document.querySelector('.app-cloud').addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('div.file-drag-and-drop').forEach(box => box.remove());
    });
    document.querySelector('.app-cloud').addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    document.querySelector('.app-cloud').addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('div.file-drag-and-drop').forEach(box => box.remove());
        fileDropedCloud(e);
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

        const response = await fetch('/api/cloud/getAllFiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token
            })
        });
        let file = await response.json();

        if (path) {
            let actualId = path;
            while (actualId != null) {
                let newHeaderPlus = new DOMParser().parseFromString(`<i class="material-icons arrow-for-cloud">arrow_forward_ios</i><span onclick="enterInFolder('${actualId}')">${file.filter(f => f.id == actualId)[0].name}</span>`, 'text/html');
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
                `<div id="${folders[i].id}" type="${folders[i].type}" class="folder" onclick="enterInFolder('${folders[i].id}')">
                    <i class="material-icons">folder</i>
                    <p class="cooltip">${file.filter(fileItem => fileItem.type == "folder").filter(fileItem => fileItem.parent == folders[i].id).length} folder${(file.filter(fileItem => fileItem.type == "folder").filter(fileItem => fileItem.parent == folders[i].id).length > 1) ? `s` : ``} / ${file.filter(fileItem => fileItem.type == "file").filter(fileItem => fileItem.parent == folders[i].id).length} file${(file.filter(fileItem => fileItem.type == "file").filter(fileItem => fileItem.parent == folders[i].id).length > 1) ? `s` : ``}</p>

                    <h1>${folders[i].name}</h1>
                </div>`
        }
        for (let i = 0; i < files.length; i++) {

            main.innerHTML +=
                `<div id="${files[i].id}" type="${files[i].type}" isuploadedfile="${files[i].isUploadedFile}" class="folder" onclick="enterInEditor('${files[i].id}', '${files[i].parent}')">
                <i class="material-icons">description</i>
                <p class="cooltip">${octetToString(files[i].size) || "non défini"}</p>
                <h1>${files[i].name}</h1>
            </div>`
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
                `;
                contextmenu.style.top = e.pageY + 'px';
                contextmenu.style.left = e.pageX + 'px';
                mainContent.appendChild(contextmenu);
            });
        });
    }
}
function enterInEditor(fileId, parentFolderId){
    mainContent.id = "editorjs";
    fetch('/api/cloud/getFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            fileId: fileId,
            isUploadedFile: document.getElementById(fileId) ? document.getElementById(fileId).getAttribute('isuploadedfile') : false,
            ext: document.getElementById(fileId) ? document.getElementById(fileId).querySelector('h1').innerHTML.split('.').length > 1 ? (document.getElementById(fileId).querySelector('h1').innerHTML.split('.')[document.getElementById(fileId).querySelector('h1').innerHTML.split('.').length - 1]) : null : null
        })
    })
    .then(response => response.json())
    .then(file => {
        if(!file.content){
            let ext = file.ext;
            let data = file.data;
            let acceptedExtensionsImages = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff', 'svg', 'ico'];
            let acceptedExtensionsVideos = ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'wmv', 'flv', 'swf', 'avi', 'mpg', 'mpeg', '3gp', '3g2'];
            let acceptedExtensionsDocuments = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'pdf', 'rtf', 'txt', 'tex', 'csv', 'tsv', 'html', 'htm', 'xml', 'xsl', 'yml', 'yaml', 'json', 'js', 'css', 'php', 'java', 'py', 'c', 'cpp', 'cs', 'csharp', 'go', 'h'];
            if(acceptedExtensionsImages.includes(ext)){
                //convert buffer into image
                // let binary = Array.from(new Uint8Array(data));
                // let imgData = new Blob([binary], {type: 'application/octet-binary'});
                // let link = URL.createObjectURL(imgData);
                // let img = new Image();
                // img.onload = () => URL.revokeObjectURL(link);
                // img.src = link;
                // img.style.width = "100%";
                // img.style.height = "100%";
                // mainContent.innerHTML = "";
                // mainContent.appendChild(img);
            }

        }else{
            let countDown;
            let countDown2; 
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
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            token: token,
                            id: fileId,
                            newName: document.querySelector('.filename-cloud').innerText,
                            isFile: true,
                            isUploadedFile:false
                        })
                    }).then(response => response.json()).then(data => {
                        if (data.success) {
                            issave = true;
                        }
                    }
                    ).catch(error => {
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
                            fetch('/api/cloud/saveFile', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    token: token,
                                    fileId: fileId,
                                    content: savedData
                                })
                            })
                            .then(response => response.json()).then(data => {
                                if (data.success) {
                                    issave = true;
                                }
                            }).catch(error => {
                                console.log(error);
                            });
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
        }
    });

}


function createFolder() {
    clearContextMenu();
    let createFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    fetch('/api/cloud/createFolder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            path: createFolderPath
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            enterInFolder(createFolderPath, true);
        }
    }).catch(error => {
        console.log(error);
    });
}

function createFile() {
    clearContextMenu();
    let createFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    fetch('/api/cloud/createFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            parentId: createFolderPath
        })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            enterInEditor(data.fileId, createFolderPath);
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                id: id,
                isFile: (type == "file" ? true : false),
                isUploadedFile: (type == "file" ? document.getElementById(id).getAttribute('isuploadedfile') : null),
                ext: (type == "file" ? document.getElementById(id).querySelector('h1').innerText.split('.')[document.getElementById(id).querySelector('h1').innerText.split('.').length - 1] : null)
            })
        }).then(response => response.json()).then(data => {
            if (data.success) {
                enterInFolder(parentFolderPath, true);
            }
        }).catch(error => {
            console.log(error);
        });
    }else{
        alert("Vous ne pouvez pas supprimer un dossier qui contient des fichiers ou dossiers");
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
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        id: id,
                        newName: newName,
                        isFile: (type == "file" ? true : false),
                        isUploadedFile: (type == "file" ? document.getElementById(id).getAttribute('isuploadedfile') : null),
                    })
                }).then(response => response.json()).then(data => {
                    if (data.success) {
                        enterInFolder(parentFolderPath, true);
                    }
                }
                ).catch(error => {
                    console.log(error);
                });
            }

        }
    });
}
function octetToString(octet) {
    let octetString = octet;
    
    if(octetString == null){
        return false;
    }else{
    if (octetString > 1024 * 1024 * 1024) {
        octetString = (octetString / 1024 / 1024 / 1024).toFixed(2) + ' Go';
    } else if (octetString > 1024 * 1024) {
        octetString = (octetString / 1024 / 1024).toFixed(2) + ' Mo';
    } else if (octetString > 1024) {
        octetString = (octetString / 1024).toFixed(2) + ' Ko';
    } else {
        octetString = octetString + ' octet';
    }
    return octetString;
}
}


function fileDropedCloud(e) {
    
    let files = e.target.files || e.dataTransfer.files;
    let parentFolderPath = headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick') != "enterInFolder()" ? headerPath.querySelectorAll('span')[headerPath.querySelectorAll('span').length - 1].getAttribute('onclick').split('\(\'')[1].replace('\'\)', '') : null;
    let formData = new FormData();
    formData.append('token', token);
    formData.append('parentId', parentFolderPath);
    formData.append('nbrFiles', files.length);
    for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i]);
    }
    fetch('/api/cloud/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(data => {
        if (data.success) {
            enterInFolder(parentFolderPath, true);
            document.querySelector('.file-input-upload-cloud').value = '';
        }
    }).catch(error => {
        console.log(error);
    });
}