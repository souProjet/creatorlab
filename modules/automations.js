let Infos = class Infos {
    constructor(fetch, io, bdd) {
        this.fetch = fetch;
        this.io = io;
        this.bdd = bdd;
    }
    unSeen() {
        this.io.of('/').sockets.forEach(async socket => {
            let userInfoBdd = await this.bdd.getUserBySocketId(socket.id);
            if (userInfoBdd) {
                if (userInfoBdd.length > 0) {
                    let nbrUnSeen = await this.getUnSeen(userInfoBdd[0].clientId);
                    if (nbrUnSeen) {
                        socket.emit('unseen', {
                            nbrUnSeenNotif: nbrUnSeen.notifs,
                            nbrUnSeenMessage: nbrUnSeen.messages
                        })
                    }
                }
            }
        });
    }
    async getUnSeen(clientId) {
        return new Promise(async resolve => {
            this.fetch(`https://elyco.itslearning.com/RestApi/keepalive/online/v1`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `ASP.NET_SessionId=${clientId}`
                    }
                }).then(res => res.json())
                .then(body => {
                    resolve({
                        notifs: body.UnseenNotifications,
                        messages: body.UnreadMessages
                    });
                }).catch(err => {
                    resolve(false);
                });

        });
    }
    async ping() {
        // this.io.of('/').sockets.forEach(async socket => {
        //     let userInfoBdd = await this.bdd.getUserBySocketId(socket.id);
        //     if (userInfoBdd) {
        //         if (userInfoBdd.length > 0) {
        //             try {
        //                 this.fetch('https://eu1realtime.itslearning.com/signalr/hubs/ping', {
        //                         method: 'GET',
        //                         headers: {
        //                             'Content-Type': 'application/json',
        //                             'Cookie': `ASP.NET_SessionId=${userInfoBdd[0].clientId}`
        //                         }
        //                     }).then(res => res.json())
        //                     .then(body => {
        //                         if (body.Response != "pong") {
        //                             socket.emit('disconnected');
        //                         }

        //                     })
        //                     .catch(err => {
        //                         console.log(err);
        //                     });
        //             } catch (err) {
        //                 console.log(err);
        //             }

        //         }
        //     }
        // });
    }
}
module.exports = {
    Infos
};