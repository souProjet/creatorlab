const fetch = require('node-fetch');
class Webhook {
    constructor(url) {
        this.url = url;
    }
    send(message, amelia = false) {
        fetch(this.url, {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "key": amelia ? amelia : null
            },
            "body": JSON.stringify(message)
        })
    }
}

// DISCORD WEBHOOK
const webhook = new Webhook(process.argv[2]);
webhook.send({
    "content": "Déploiement de Creatorlab terminé !"
});

//AMELIA WEBHOOK
const amelia = new Webhook(process.argv[3]);
amelia.send({
        "action": "send",
        "desti": process.argv[4],
        "type": "text",
        "message": "Déploiement de Creatorlab terminé !"
    },
    process.argv[5]
)