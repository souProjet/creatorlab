const HOME_USERDATA = process.argv.includes('--dev') ? './' : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.creatorlab_data";

let Reportcard = class Reportcard {
    constructor(fs) {
        this.fs = fs;
    }
    updateReportcard(token, reportcard) {
        this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/reportcard.json', JSON.stringify(reportcard), (err) => {
            if (err) return false;
        });
        return true
    }

    get(token) {
        try {
            let reportcardJSON = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/reportcard.json', 'utf8', (err) => {
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
        } catch (err) {
            return {
                status: false,
                message: err
            }
        }

    }
}

module.exports = Reportcard;