const HOME_USERDATA = process.argv.includes('--dev') ? './' : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "/.creatorlab_data";

let Schedule = class Schedule {
    constructor(fs) {
        this.fs = fs;
    }
    updateSchedule(token, schedule) {
        this.fs.writeFileSync(HOME_USERDATA + '/userdata/' + token + '/schedule.json', JSON.stringify(schedule), (err) => {
            if (err) return false;

        });
        return true
    }

    get(token) {
        try {
            let scheduleJSON = this.fs.readFileSync(HOME_USERDATA + '/userdata/' + token + '/schedule.json', 'utf8', (err) => {
                if (err) {
                    return {
                        status: false,
                        message: 'Erreur lors de la récupértion de l\'emplois du temps'
                    }
                }
            });

            return {
                status: true,
                message: 'Récupération de l\'emplois du temps réussie',
                schedule: scheduleJSON
            }
        } catch (err) {
            return {
                status: false,
                message: err
            }
        }
    }
}

module.exports = Schedule;