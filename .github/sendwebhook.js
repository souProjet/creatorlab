const fetch = require('node-fetch');
class Webhook {
    constructor(url) {
        this.url = url;
    }
    send(message) {
        fetch(this.url, {
            "method": "POST",
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(message)
        })
    }
}
const webhook = new Webhook(process.argv[2]);
webhook.send({
    "content": "Déploiement de Creatorlab terminé !"
});