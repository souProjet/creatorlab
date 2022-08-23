let Schedule = class Schedule {
    constructor(fs) {
        this.fs = fs;
    }
    updateSchedule(token, schedule) {
        this.fs.writeFileSync('./userdata/' + token + '/schedule.json', JSON.stringify(schedule), (err) => {
            if (err) return false;

        });
        return true
    }

    get(token) {
        let scheduleJSON = this.fs.readFileSync('./userdata/' + token + '/schedule.json', 'utf8', (err) => {
            if (err) {
                return {
                    status: false,
                    message: 'Erreur lors de la récupértion de l\'emloie du temps'
                }
            }
        });

        return {
            status: true,
            message: 'Récupération de l\'emploie du temps réussie',
            schedule: scheduleJSON
        }
    }
}

module.exports = Schedule;