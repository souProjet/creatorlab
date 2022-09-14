let Notification = class Notification {
    constructor(fetch) {
        this.fetch = fetch;
    }
    async getNotifications(sessionId) {

        let response = await this.fetch('https://elyco.itslearning.com/RestApi/notifications/getPersonalNotifications', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                if (body.includes('401 - Unauthorized: Access is denied due to invalid credentials.')) {
                    return {
                        status: false,
                        message: 'Unauthorized'
                    }
                } else {
                    return {
                        status: true,
                        message: body
                    }

                }
            })
            .catch(err => {
                console.log(err);
            });

        return response;

    }
    formatNotifications(notifs) {
        let notifsResult = [];
        let notifsMatiereRegex = notifs.match(/(Nouveau message disponible dans <a title=".[^"]+)/gm) || [];
        let notifsMatiere = [];
        notifsMatiereRegex.forEach(matiere => {
            notifsMatiere.push(matiere.replace(/(Nouveau message disponible dans <a title=")/gm, ''));
        });
        let notifsDateRegex = notifs.match(/(<span class='itsl-widget\-extrainfo'[\s]+title=".+">[\s]*.+)/gm) || [];
        let notifsDate = [];
        notifsDateRegex.forEach(date => {
            notifsDate.push(date.replace(/(<span class='itsl-widget\-extrainfo'[\s]+title=".+">[\s]*)/gm, '').trim());
        });
        let notifsAuthorRegex = notifs.match(/(<span class="h-va-bottom">.[^<\/span]+)/gm) || [];
        let notifsAuthor = [];
        notifsAuthorRegex.forEach(author => {
            notifsAuthor.push(author.replace(/(<span class="h-va-bottom">)/gm, ''));
        });
        let notifsImgRegex = notifs.match(/(<img class="h-va-middle h-mrr5"[\s]+src=".[^"]+)/gm) || [];
        let notifsImg = [];
        notifsImgRegex.forEach(img => {
            notifsImg.push(img.replace(/(<img class="h-va-middle h-mrr5"[\s]+src=")/gm, ''));
        });

        let notifsCourseIdRegex = notifs.match(/(\/ContentArea\/ContentArea\.aspx\?LocationType=1&amp;LocationID=[0-9]*)/gm) || [];
        let notifsCourseId = [];
        notifsCourseIdRegex.forEach(courseId => {
            notifsCourseId.push(courseId.replace(/(\/ContentArea\/ContentArea\.aspx\?LocationType=1&amp;LocationID=)/gm, ''));
        });

        let notifsIdRegex = notifs.match(/data-id="[0-9]{9}/gm) || []
        let notifsId = []
        notifsIdRegex.forEach(id => {
            notifsId.push(id.replace('data-id="', ''));
        })
        for (let i = 0; i < notifsAuthor.length; i++) {
            notifsResult.push({
                matiere: notifsMatiere[i],
                date: notifsDate[i],
                author: notifsAuthor[i],
                img: notifsImg[i],
                courseId: notifsCourseId[i],
                id: notifsId[i]
            });
        }
        return {
            status: true,
            message: notifsResult
        };

    }

    async getUnSeenNotifications(sessionId) {
        let response = await this.fetch(`https://elyco.itslearning.com/RestApi/keepalive/online/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            }).then(res => res.json())
            .then(body => {
                return {
                    status: true,
                    nbrunseen: body.UnseenNotifications,
                    message: 'Succès'
                };
            }).catch(err => {
                return {
                    status: false,
                    message: err
                }
            });
        return response;
    }

    updateReadNotifications(formatedNotifs, nbrunseen, sessionId) {
        let idsUnSeenNotifs = '';
        for (let i = 0; i < nbrunseen; i++) {
            idsUnSeenNotifs += formatedNotifs[formatedNotifs.length - (i + 1)].id + (i != (nbrunseen - 1) ? ',' : null)
        }
        this.fetch('https://elyco.itslearning.com/restapi/notifications/updateReadNotifications', {
            method: 'POST',
            headers: {
                'Cookie': `ASP.NET_SessionId=${sessionId}`
            },
            body: JSON.stringify({
                notifications: idsUnSeenNotifs
            })
        })
    }
}
module.exports = Notification;