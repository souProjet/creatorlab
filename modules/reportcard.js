let Reportcard = class Reportcard {
    constructor(fs) {
        this.fs = fs;
    }
    updateReportcard(token, reportcard) {
        this.fs.writeFileSync('./userdata/' + token + '/reportcard.json', JSON.stringify(reportcard), (err) => {
            if (err) return false;
        });
        return true
    }

    get(token) {
        let reportcardJSON = this.fs.readFileSync('./userdata/' + token + '/reportcard.json', 'utf8', (err) => {
            if (err) {
                return {
                    status: false,
                    message: 'Erreur lors de la récupértion du bulletin de notes'
                }
            }
        });
        return {
            status: true,
            message: 'Récupération du bulletin de notes réussi',
            reportcard: reportcardJSON
        }

    }
}

module.exports = Reportcard;