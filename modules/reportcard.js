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
}

module.exports = Reportcard;