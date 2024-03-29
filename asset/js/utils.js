let Utils = class Utils {
        constructor() {}
        createModal(msg, error = false) {
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
    timeTemplate(){
        return ['08h05', '08h30', '09h00', '9h30', '10h15', '10h45', '11h10', '11h40', '12h05', '12h30', '13h00', '13h30', '13h55', '14h25', '14h50', '15h20', '16h05', '16h35', '17h00', '17h30', '17h55'];
    }
    dayTemplate(){
        return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    }
    escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\//g, '&#x2F;')
    }
    calculateTimeBetweenDateAndToday(date) {
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
    calculateTimeBetweenTwoDates(date1, date2) {
        let date1ms = new Date(date1).getTime();
        let date2ms = new Date(date2).getTime();
        let timeBetween = date2ms - date1ms;
        let time = Math.floor(timeBetween / (1000 * 60 * 60));
        let ans = Math.floor(time / (24 * 30 * 12));
        let mois = Math.floor(time / (24 * 30));
        let semaines = Math.floor(time / (24 * 7));
        let jours = Math.floor(time / (24));
        //vérifier si timeBetween est négatif
        if (timeBetween < 0) {
            return '<span style="color:red">passée&nbsp;</span> ';
        } else {
            return (ans ? ans + ' an'+(ans > 1 ? 's' : '')+' restant'+(ans > 1 ? 's' : '') : mois ? mois + ' mois restant'+(mois > 1 ? 's' : '') : semaines ? semaines + ' semaine'+(semaines > 1 ? 's' : '')+' restante'+(semaines > 1 ? 's' : '') : jours ? jours + ' jour'+(jours > 1 ? 's' : '')+' restant'+(jours > 1 ? 's' : '') : 'aujourd\'hui');
        }
    }

    replaceURLWithHTMLLinks(text) {
        text = utils.htmlDecode(text);
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    }
    monthByName(month) {
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
        return monthByName[month];
    }
    nameToColor(){
        return {
            'FRANCAIS': 'green',
            'PHYSIQUE-CHIMIE': 'orange',
            'MATHEMATIQUES': 'red',
            'HISTOIRE-GEOGRAPHIE': 'yellow',
            'SCIENCES VIE &; TERRE': 'blue',
            'ESPAGNOL LV2': 'pink',
            'SC. ECONO.& SOCIALES': 'black',
            'ANGLAIS LV1': 'light-gray',
            'SC.NUMERIQ.TECHNOL.': 'purple',
            'ACCOMPAGNEMENT PERSO': 'brown',
            'ENS. MORAL & CIVIQUE': 'gray',
            'ED.PHYSIQUE & SPORT.': 'dark-gray',
            'VIE DE CLASSE': 'dark-blue',
        }
    }
    getToken() {
        return this.escapeHTML(document.cookie.split('=')[1]);
    }
    include(url){
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        let nodes = document.getElementsByTagName("*");
        let node = nodes[nodes.length -1].parentNode;
        node.appendChild(script);
    }
    courseToIcon(title) {
        let iconText = [{
                'name': 'geographie',
                'icon': 1
            }, {
                'name': 'histoire',
                'icon': 15
            }, {
                'name': 'francais',
                'icon': 5
            }, {
                'name': 'mathematiques',
                'icon': 3
            }, {
                'name': 'physique-chimie',
                'icon': 4
            }, {
                'name': 'chimie',
                'icon': 6
            }, {
                'name': 'biologie',
                'icon': 7
            }, {
                'name': 'anglais',
                'icon': 8
            }, {
                'name': 'espagnol',
                'icon': 9
            }, {
                'name': 'allemand',
                'icon': 10
            }, {
                'name': 'musique',
                'icon': 16
            }, {
                'name': 'art',
                'icon': 2
            }, {
                'name': 'litterature',
                'icon': 11
            }, {
                'name': 'sport',
                'icon': 12
            },
            {
                'name': 'sociologie',
                'icon': 13
            }, {
                'name': 'economie',
                'icon': 14
            },
            {
                'name': 'terre',
                'icon': 7
            },
        ]
        for (let i = 0; i < iconText.length; i++) {
            if (title.toLowerCase().includes(iconText[i].name)) {
                return iconText[i].icon;
            }
        }
        return 'default';
    
    }
    updateSidebarLoaderState() {
        sidebarItems = document.querySelectorAll('.sidebar_inner ul li');
        if (localStorage.getItem('activePage') && localStorage.getItem('activePage') != "Accueil" && Array.from(sidebarItems).find(item => item.querySelector('span').innerText == localStorage.getItem('activePage'))) {
            sidebarItems.forEach(item => {
                if (item.querySelector('span').innerHTML == localStorage.getItem('activePage') && !item.classList.contains('active') && !item.classList.contains('hide')) {
                    item.click();
                }
            });
        }

    }
    octetToString(octet) {
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
    b64toBlob(data, type){
        let sliceSize = 512;
        let byteCharacters = atob(data);
        let byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
    
            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        let blob = new Blob(byteArrays, {type: type});
        return blob;
    }
    async domToPng(node) {
        let url = await domtoimage.toPng(node)
            .then(async function(dataUrl) {
                return await dataUrl
            })
            .catch(function(error) {
                console.error('oops, something went wrong!', error);
            });
        return url;
    }
    htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }
    urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
    
        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);
    
        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}