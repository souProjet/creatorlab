mainContent = document.querySelector('.main_content .mcontainer');
let sidebarItemSchedule = document.querySelector('.sidebar_inner ul li:nth-child(4)');
const timeTemplate = ['08h05', '08h30', '09h00', '9h30', '10h15', '10h45', '11h10', '11h40', '12h05', '12h30', '13h00', '13h30', '13h55', '14h25', '14h50', '15h20', '16h05', '16h35', '17h00', '17h30', '17h55'];
const dayTemplate = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
let scheduleJSON;
sidebarItemSchedule.addEventListener('click', function() {
    fetch('/api/getSchedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.text())
        .then(res => {
            scheduleJSON = JSON.parse(JSON.parse(res).scheduleJSON);
            createSchedule();
            window.addEventListener('resize', function() {
                if (sidebarItemSchedule.classList.contains('active')) {
                    createSchedule();
                }
            });
            mainContainer.classList.remove('hide');
        }).catch(err => {
            console.log(err);
        });
});
let today = new Date();
let day = today.getDay();
if (day == 6 || day == 0) {
    day = 5;
}

function createSchedule() {
    let isMobile = window.innerWidth >= 1200 ? false : true;

    dayName = dayTemplate[day - 1];
    let scheduleDom = document.createElement('div');
    scheduleDom.id = 'schedule';
    let scheduleDomLegend = document.createElement('div');
    scheduleDomLegend.classList.add('s-legend');
    for (let i = 0; i < timeTemplate.length + 1; i++) {
        if (i == 0) {
            let scheduleDomLegendInfo = document.createElement('div');
            scheduleDomLegendInfo.classList.add('s-cell');
            scheduleDomLegendInfo.classList.add('s-head-info');
            scheduleDomLegendInfo.innerHTML = "<div class='s-name'>\\</div>";
            scheduleDomLegend.appendChild(scheduleDomLegendInfo);
        } else {
            let scheduleDomLegendItem = document.createElement('div');
            scheduleDomLegendItem.classList.add('s-head-hour');
            scheduleDomLegendItem.classList.add('s-cell');
            scheduleDomLegendItem.innerHTML = "<div class='s-day'>" + timeTemplate[i - 1] + "</div>";
            scheduleDomLegend.appendChild(scheduleDomLegendItem);
        }
    }
    scheduleDom.appendChild(scheduleDomLegend);
    let scheduleDomBody = document.createElement('div');
    scheduleDomBody.classList.add('s-block');
    scheduleDomBody.classList.add('s-container');
    let scheduleDomDays = document.createElement('div');
    scheduleDomDays.classList.add('s-head-info');
    if (isMobile) {
        let scheduleDomDay = document.createElement('div');
        scheduleDomDay.classList.add('s-week-day');
        scheduleDomDay.innerHTML = "<div class='s-number'>" + dayName + "</div>";
        scheduleDomDays.appendChild(scheduleDomDay);
    } else {
        for (let i = 0; i < dayTemplate.length; i++) {
            let scheduleDomDay = document.createElement('div');
            scheduleDomDay.classList.add('s-week-day');
            scheduleDomDay.innerHTML = "<div class='s-number'>" + dayTemplate[i] + "</div>";
            scheduleDomDays.appendChild(scheduleDomDay);
        }
    }
    scheduleDomBody.appendChild(scheduleDomDays);
    let scheduleDomCells = document.createElement('div');
    scheduleDomCells.classList.add('s-rows-container');
    scheduleDomCells.innerHTML = `<div class='s-activities'></div>`;
    if (isMobile) {
        let scheduleDomRow = document.createElement('div');
        scheduleDomRow.classList.add('s-row');
        scheduleDomRow.classList.add('s-hour-row');
        for (let j = 0; j < timeTemplate.length; j++) {
            let scheduleDomCell = document.createElement('div');
            scheduleDomCell.classList.add('s-cell');
            scheduleDomCell.classList.add('s-hour-wrapper');
            scheduleDomCell.innerHTML = "<div class='s-divider-day'></div>";
            scheduleDomRow.appendChild(scheduleDomCell);
        }
        scheduleDomCells.appendChild(scheduleDomRow);
    } else {
        for (let i = 0; i < dayTemplate.length; i++) {
            let scheduleDomRow = document.createElement('div');
            scheduleDomRow.classList.add('s-row');
            scheduleDomRow.classList.add('s-hour-row');
            for (let j = 0; j < timeTemplate.length; j++) {
                let scheduleDomCell = document.createElement('div');
                scheduleDomCell.classList.add('s-cell');
                scheduleDomCell.classList.add('s-hour-wrapper');
                scheduleDomCell.innerHTML = "<div class='s-divider-day'></div>";
                scheduleDomRow.appendChild(scheduleDomCell);
            }
            scheduleDomCells.appendChild(scheduleDomRow);
        }
    }
    scheduleDomBody.appendChild(scheduleDomCells);
    scheduleDom.appendChild(scheduleDomBody);


    mainContent.innerHTML = scheduleDom.outerHTML;
    if (!isMobile) {
        showSchedule(scheduleJSON);
    } else {
        showSchedule(scheduleJSON, day);
        document.querySelectorAll('btn-schedule-switch-day').forEach(el => {
            el.remove();
        });
        let rightArrow = document.createElement('div');
        if (day != 5) {
            rightArrow.innerHTML = `
            <svg class="btn-schedule-switch-day right-btn" style="position:absolute; z-index:50; height:30px; width:30px; right:10%; cursor:pointer;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 490.4 490.4" style="enable-background:new 0 0 490.4 490.4;" xml:space="preserve">
                <g>
                    <g>
                        <path d="M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5
                            c121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z"/>
                        <path d="M138.7,257.5h183.4l-48,48c-4.8,4.8-4.8,12.5,0,17.3c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l68.9-68.9
                            c4.8-4.8,4.8-12.5,0-17.3l-68.9-68.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l48,48H138.7c-6.8,0-12.3,5.5-12.3,12.3
                            C126.4,252.1,131.9,257.5,138.7,257.5z"/>
                    </g>
                </g>
            </svg>`;
            rightArrow.addEventListener('click', () => {
                scheduleToRight(rightArrow);
            });
            mainContent.insertBefore(rightArrow, mainContent.firstChild);

        }

        if (day != 1) {

            let leftArrow = document.createElement('div');
            leftArrow.innerHTML = `
            <svg class="btn-schedule-switch-day left-btn" style="position:absolute; z-index:50; height:30px; width:30px; left:20%; cursor:pointer; transform:rotate(180deg);" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 490.4 490.4" style="enable-background:new 0 0 490.4 490.4;" xml:space="preserve">
                <g>
                    <g>
                        <path d="M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5
                            c121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z"/>
                        <path d="M138.7,257.5h183.4l-48,48c-4.8,4.8-4.8,12.5,0,17.3c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l68.9-68.9
                            c4.8-4.8,4.8-12.5,0-17.3l-68.9-68.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l48,48H138.7c-6.8,0-12.3,5.5-12.3,12.3
                            C126.4,252.1,131.9,257.5,138.7,257.5z"/>
                    </g>
                </g>
            </svg>`;

            leftArrow.addEventListener('click', () => {
                scheduleToLeft(leftArrow);
            });
            mainContent.insertBefore(leftArrow, mainContent.firstChild);

        }

    }
}

function scheduleToRight(el) {
    day++;
    if (day == 5) {
        el.style.display = 'none';
    }
    createSchedule();
}

function scheduleToLeft(el) {
    day--;
    if (day == 1) {
        el.remove()
    }
    createSchedule();

}

function showSchedule(scheduleJSON, oneday = false) {
    let nameToColor = {
        'FRANCAIS': 'green',
        'PHYSIQUE-CHIMIE': 'orange',
        'MATHEMATIQUES': 'red',
        'HISTOIRE-GEOGRAPHIE': 'yellow',
        'SCIENCES VIE &amp; TERRE': 'blue',
        'ESPAGNOL LV2': 'pink',
        'SC. ECONO.&amp; SOCIALES': 'black',
        'ANGLAIS LV1': 'light-gray',
        'SC.NUMERIQ.TECHNOL.': 'purple',
        'ACCOMPAGNEMENT PERSO': 'brown',
        'ENS. MORAL &amp; CIVIQUE': 'gray',
        'ED.PHYSIQUE &amp; SPORT.': 'dark-gray',
        'VIE DE CLASSE': 'dark-blue'
    }
    let courseContainerElement = document.querySelector('.s-activities');
    if (oneday) {
        scheduleJSON = scheduleJSON.filter(course => course.col == oneday);
    }
    for (let i = 0; i < scheduleJSON.length; i++) {
        let course = scheduleJSON[i];
        courseContainerElement.innerHTML += `
        <div class='s-act-tab ${nameToColor[course.subject] == undefined ? nameToColor[Object.keys(nameToColor)[Math.floor(Math.random()*Object.keys(nameToColor).length)]] : nameToColor[course.subject]}' style="height:${2*36*course.height}px;padding:${30*course.height}px;width:${!oneday ? 20 : 100}%;top:${2*36 * (course.row-1)}px;left:${!oneday ? 20*(course.col - 1) : 0}%;">
            <div class='s-act-name' style="${(course.event ? (course.event == "Cours modifié" ? 'color:#525db3;' : '') : '')}${(course.event ? ((course.event != "Cours modifié" && course.event != "Changement de salle") ? 'color:red;text-decoration:line-through;' : '') : '')}">${course.subject}</div>
            <div class='s-wrapper'>
                <div class='s-act-teacher'>${course.teacher}</div>
                <div class='s-act-room'  style="${(course.event ? (course.event == "Changement de salle" ? 'color:red;text-decoration:line-through;' : '') : '')}">${course.room}</div>
            </div>
        </div>
        `;
    }
}