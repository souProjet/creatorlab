let Cloud = class Cloud {
    constructor(fs) {
        this.fs = fs;
    }
    generateToken(length = 8) {
        let token = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }

    createFolder(token, path) {
        let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
        arch = JSON.parse(arch);
        arch.push({
            type: 'folder',
            name: 'Nouveau dossier',
            parent: path,
            id: this.generateToken()
        });
        this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("Folder created : " + token);
            }
        });

    }

    createFile(token, parentId) {
        let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
        arch = JSON.parse(arch);
        let fileId = this.generateToken();
        arch.push({
            type: 'file',
            name: 'Nouveau fichier',
            parent: parentId,
            isUploadedFile: false,
            id: fileId,
            size: 0
        });
        this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("File created in arch : " + token);
            }
        });
        this.fs.writeFileSync('./userdata/' + token + '/data/' + fileId + '.json', JSON.stringify({ name: 'Nouveau fichier', content: {} }), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("File created : " + token);
            }
        });
        return fileId;
    }

    delete(token, id, isFile, isUploadedFile, ext) {
        let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
        arch = JSON.parse(arch);

        arch = arch.filter(file => file.id != id);

        if (arch.filter(file => file.parent == id).length == 0) {

            this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                if (error) {
                    console.log(error);
                } else {
                    // console.log("Folder deleted : " + token);
                }
            });

            if (isFile) {
                if (isUploadedFile) {
                    this.fs.unlink('./userdata/' + token + '/data/' + id + '.' + ext, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                } else {
                    this.fs.unlink('./userdata/' + token + '/data/' + id + '.json', (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            }
        }

    }

    rename(token, id, newName, isFile, isUploadedFile) {
        let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
        arch = JSON.parse(arch);
        arch.forEach(file => {
            if (file.id == id) {
                file.name = newName;
            }
        });
        this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("Folder renamed : " + token);
            }
        });
        if (isFile) {
            let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);
            arch.forEach(file => {
                if (file.id == id) {
                    file.name = newName;
                }
            });
            this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                if (error) {
                    console.log(error);
                }
            });
            if (!isUploadedFile) {
                let data = this.fs.readFileSync('./userdata/' + token + '/data/' + id + '.json');
                data = JSON.parse(data);
                data.name = newName;

                this.fs.writeFileSync('./userdata/' + token + '/data/' + id + '.json', JSON.stringify(data), (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        // console.log("File renamed : " + token);
                    }
                });
            }
        }

    }

    getAllFiles(token) {
        return JSON.parse(this.fs.readFileSync('./userdata/' + token + '/arch.json'));
    }
    createUserDataProfile(token) {
        this.fs.mkdir('./userdata/' + token, (error) => {
            if (error) {
                console.log(error);
            } else {
                this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify([]), (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        this.fs.mkdir('./userdata/' + token + '/data', (error) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Userdata profile created : " + token);

                            }
                        });
                    }
                });
            }
        });
    }

    getFile(token, id, isUploadedFile, ext) {
        if (isUploadedFile) {
            return {
                ext: ext,
                data: this.fs.readFileSync('./userdata/' + token + '/data/' + id + '.' + ext)
            }
        } else {
            return JSON.parse(this.fs.readFileSync('./userdata/' + token + '/data/' + id + '.json'));
        }
    }

    saveFile(token, id, content) {
        let data = this.fs.readFileSync('./userdata/' + token + '/data/' + id + '.json');
        data = JSON.parse(data);
        data.content = content;
        this.fs.writeFileSync('./userdata/' + token + '/data/' + id + '.json', JSON.stringify(data), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("File saved : " + token);
            }
        });

        //update file size
        let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
        arch = JSON.parse(arch);
        arch.forEach(file => {
            if (file.id == id) {
                file.size = this.fs.statSync('./userdata/' + token + '/data/' + id + '.json').size;
            }
        });
        this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("File size updated : " + token);
            }
        });
    }

    upload(token, parentId, file) {
        let fileId = this.generateToken();
        let fileExtension = file.name.split('.')[file.name.split('.').length - 1];
        let acceptedExtensions = ['json', 'png', 'jpg', 'jpeg', 'gif', 'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'zip', 'rar', '7z', 'bz2', 'mp4', 'mp3', 'avi', 'flv', 'mpg', 'mpeg', 'mkv', 'mov', 'wmv', '3gp', '3g2', 'webm', 'ogg'];
        if (acceptedExtensions.indexOf(fileExtension) == -1) {
            return false;
        }
        let arch = this.fs.readFileSync('./userdata/' + token + '/arch.json');
        arch = JSON.parse(arch);
        arch.push({
            type: 'file',
            name: file.name,
            parent: parentId == "null" ? null : parentId,
            isUploadedFile: true,
            id: fileId,
            size: file.size,
        });
        this.fs.writeFileSync('./userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("File uploaded in arch : " + token);
            }
        });
        this.fs.writeFileSync('./userdata/' + token + '/data/' + fileId + '.' + fileExtension, file.data, (error) => {
            if (error) {
                console.log(error);
            }
        });
    }
}

module.exports = Cloud;