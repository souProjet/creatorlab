const HOME_USERDATA = process.argv.includes('--dev') ? './' : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.creatorlab_data";

let Cloud = class Cloud {
    constructor(fs, utf8) {
        this.fs = fs;
        this.utf8 = utf8;
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
        try {
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);
            arch.push({
                type: 'folder',
                name: 'Nouveau dossier',
                parent: path,
                id: this.generateToken()
            });
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                if (error) {
                    console.log(error);
                }
            });
            return true;
        } catch (error) {
            return false;
        }

    }

    createFile(token, parentId) {
        try {
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
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
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                if (error) {
                    console.log(error);
                }
            });
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + fileId + '.json', JSON.stringify({ name: 'Nouveau fichier', content: {} }), (error) => {
                if (error) {
                    console.log(error);
                }
            });
            return {
                status: true,
                fileId: fileId
            }
        } catch (error) {
            return {
                status: false,
                message: 'Erreur lors de la création du fichier'
            }
        }
    }

    delete(token, id, isFile, isUploadedFile, ext) {
        try {
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);

            arch = arch.filter(file => file.id != id);

            if (arch.filter(file => file.parent == id).length == 0) {

                this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                    if (error) {
                        console.log(error);
                    }
                });

                if (isFile) {
                    if (isUploadedFile) {
                        this.fs.unlink(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.' + ext, (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    } else {
                        this.fs.unlink(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json', (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    rename(token, id, newName, isFile, isUploadedFile) {
        try {
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);
            arch.forEach(file => {
                if (file.id == id) {
                    file.name = newName;
                }
            });
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                if (error) {
                    console.log(error);
                }
            });
            if (isFile) {
                let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
                arch = JSON.parse(arch);
                arch.forEach(file => {
                    if (file.id == id) {
                        file.name = newName;
                    }
                });
                this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                if (!isUploadedFile) {
                    let data = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json');
                    data = JSON.parse(data);
                    data.name = newName;

                    this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json', JSON.stringify(data), (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            }
            return true;
        } catch (error) {
            return false;
        }

    }

    get(token, filter) {
        try {
            return {
                status: true,
                data: JSON.parse(this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json'))
            }
        } catch (err) {
            return {
                status: false,
                message: 'Erreur lors de la lecture de l\'arborescence'
            };
        }
    }


    createUserDataProfile(token) {
        this.fs.mkdir(HOME_USERDATA + '/userdata/' + token, (error) => {
            if (error) {
                console.log(error);
            } else {
                this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify([]), (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                this.fs.mkdir(HOME_USERDATA + '/userdata/' + token + '/thumbnails', (error) => {
                    if (error) {
                        console.log(error);
                    }
                });

                this.fs.mkdir(HOME_USERDATA + '/userdata/' + token + '/data', (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        });
    }

    getFile(token, id) {
        try {
            return {
                status: true,
                file: JSON.parse(this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json'))
            }
        } catch (err) {
            return {
                status: false,
                message: 'Erreur lors de la lecture du fichier'
            }
        }
    }

    saveFile(token, id, content) {
        try {
            let data = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json');
            data = JSON.parse(data);
            data.content = content;
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json', JSON.stringify(data), (error) => {
                if (error) {
                    console.log(error);
                }
            });

            //update file size
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);
            arch.forEach(file => {
                if (file.id == id) {
                    file.size = this.fs.statSync(HOME_USERDATA + '/userdata/' + token + '/data/' + id + '.json').size;
                }
            });
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), (error) => {
                if (error) {
                    console.log(error);
                }
            });
            return true;
        } catch (err) {
            return false;
        }

    }

    upload(token, parentId, file) {
        try {
            let fileId = this.generateToken();
            let fileExtension = file.name.split('.')[file.name.split('.').length - 1];
            let acceptedExtensions = ['aac', 'json', 'png', 'jpg', 'jpeg', 'gif', 'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'zip', 'rar', '7z', 'bz2', 'mp4', 'mp3', 'avi', 'flv', 'mpg', 'mpeg', 'mkv', 'mov', 'wmv', '3gp', '3g2', 'webm', 'ogg'];
            if (acceptedExtensions.indexOf(fileExtension) == -1) {
                return {
                    success: false,
                    error: "Sorry, " + file.name + " : Ce format n'est pas autorisé"
                }
            }
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);
            arch.push({
                type: 'file',
                name: file.name,
                parent: parentId == "null" ? null : parentId,
                isUploadedFile: true,
                id: fileId,
                size: file.size,
            });
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json', JSON.stringify(arch), { encoding: "utf8" }, (error) => {
                if (error) {
                    console.log(error);
                    return {
                        status: false,
                        message: "Échec de l'upload de " + file.name
                    }
                }
            });
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/data/' + fileId + '.' + fileExtension, file.data, (error) => {
                if (error) {
                    console.log(error);
                    return {
                        status: false,
                        message: "Échec de l'upload de " + file.name
                    }
                }
            });
            return {
                status: true,
                message: null
            }
        } catch (err) {
            return {
                status: false,
                message: "Erreur lors de l'upload de " + file.name
            }
        }
    }

    uploadThumbnail(token, fileId, base64Data) {
        try {
            this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/thumbnails/' + fileId + '.png', base64Data, (err) => {
                if (err) throw err;
            });
            return true;
        } catch (err) {
            return false
        }
    }

    getThumbnail(token, fileId) {
        try {
            return {
                status: true,
                thumbnail: this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/thumbnails/' + fileId + '.png').toString('base64')
            }
        } catch (e) {
            return {
                status: false,
                message: "Erreur lors de la lecture de la miniature"
            };
        }
    }
    getTotalSize(token) {
        try {
            let arch = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/arch.json');
            arch = JSON.parse(arch);
            let totalSize = 0;
            arch.forEach(file => {
                totalSize += file.size ? parseInt(file.size) : 0;
            });
            return {
                status: true,
                size: totalSize
            }
        } catch (err) {
            return {
                status: false,
                message: "Erreur lors de la lecture de la taille totale"
            }
        }
    }


}

module.exports = Cloud;