let sidebarItemCourse;
sidebarItems.forEach((item) => {
    if (item.querySelector('span').innerHTML === 'Mes cours') {
        sidebarItemCourse = item;
    }
});

//si l'utilisateur clique sur l'item "cours" dans le menu 
sidebarItemCourse.addEventListener('click', function() {
            //effectuer une requête GET pour récupérer les cours de l'utilisateur
            fetch('/api/courses/preview', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).then(res => res.json()).then(data => {
                        if (data.status) {
                            if (data.courses) {
                                let coursesHTML = '';
                                let count = 0;
                                let state = false;
                                for (let i = 0; i < data.courses.length; i++) {
                                    let course = data.courses[i];
                                    if (i == 0) {
                                        coursesHTML += '<div class="divide-y -mt-3 card px-5 py-10 ">'
                                    }
                                    if (count == 0) {
                                        coursesHTML += `<div class="flex sm:flex-row flex-col sm:space-x-4 py-4 relative w-full">`;
                                    }
                                    if (course.date) {
                                        course.date = course.date.replace(/&nbsp;/igm, '');
                                    }
                                    coursesHTML += `
                        <div class="w-full max-w-sm rounded overflow-hidden shadow-lg mb-10 mt-10">
                            <a onclick="viewCourse(${course.id})" style="cursor:pointer;">
                                <img src="./public/images/courseicon/${utils.courseToIcon(course.name)}.png" class="h-44 object-cover rounded-t-md shadow-sm w-full">
                            </a>
                            <div class="p-3">
                                <h4 class="text-base font-semibold mb-0.5 coursename">${course.name}</h4>
                                <p class="font-medium text-sm">${course.date ? `modifié`+ utils.calculateTimeBetweenDateAndToday(new Date(parseInt(course.date.split('/')[2].split(' ')[0]), parseInt(course.date.split('/')[1]) - 1, parseInt(course.date.split('/')[0]), parseInt(course.date.split(' ')[1].split(":")[0]), parseInt(course.date.split(":")[1]))) : ''}</p>
                            </div>
                        </div>`;
                    count++;
                    if (count == 3) {
                        count = 0;
                        state = true;
                        coursesHTML += '</div>';
                    } else {
                        state = false;
                    }
                    if (i == data.courses.length - 1) {
                        for (let j = 0; j < 3 - count; j++) {
                            coursesHTML += `<div style="opacity:0;" class="w-full max-w-sm rounded overflow-hidden shadow-lg mb-10 mt-10"></div>`;
                        }
                        if (!state) {
                            coursesHTML += '</div>';
                        }
                        coursesHTML += `</div>`;
                    }

                }
                mainContent.innerHTML = coursesHTML;
            }
        } else {
            mainContent.innerHTML = `<div class="flex justify-center items-center h-full">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-red-800">${data.message}</h1>
                </div>
            </div>`;
        }
        mainContainer.classList.remove('hide');
    }).catch(err => {
        console.log(err);
    });
});

function viewCourse(id, isforplan = false) {
    mainContainer.classList.add('hide');
    fetch('/api/courses/details/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data => {
            if (data.status) {
                if (data.course) {

                    let course = data.course.course;
                    let courseId = data.course.courseId;

                    //   Ajout des actualitées au DOM
                    let actuHTML = ``;
                    if (course.actu.length != 0) {
                        actuHTML += `<div class="card divide-y divide-gray-100 sm:m-0 -mx-4 actu-bloc active">`;
                        for (let i = 0; i < course.actu.length; i++) {
                            let actu = course.actu[i];
                            let actuDate = actu.created;
                            let actuRes = ``;
                            for(let n = 0; n<actu.res.length; n++){
                                actuRes+= `
                                <a style="cursor:pointer;background-color: #f9f5f6;border-radius: 4px; padding:2%;width:fit-content;" class="res-link flex text-sm font-semibold" onclick="viewDoc(event, '/LearningToolElement/ViewLearningToolElement.aspx?LearningToolElementId=${actu.res[n].link.match(/(ElementID=[0-9]{8})/gm)[0].replace('ElementID=', '')}')">${actu.res[n].title}x&nbsp;&nbsp;&nbsp;
                                    <img class="w-5" src="${actu.res[n].icon}" alt="">
                                </a>
                                `
                            }
                            actuHTML += `
                            <div class="flex items-start flex-wrap p-7 sm:space-x-6 mb-10">
                                <a style="cursor:pointer;" onclick="viewprofile(${parseInt(actu.authorId)}, '${(actu.authorAvatarUrl || './public/images/defaultAvatar.png')}', '${actu.authorName.replace('(44-BOUAYE)', '').replace('\'', '\\\'')}', false)" class="w-14 h-14 relative mt-1 order-1">
                                    <img src="${actu.authorAvatarUrl || './public/images/defaultAvatar.png'}" alt="" class="rounded-md">
                                </a>
                                <div class="flex-1 sm:order-2">
                                    <h4 class="text-base text-gray-500 font-medium mb-2">` + (actuDate != null ? (actuDate) : '') + `</h4>
                                    <a style="cursor:pointer;" onclick="viewprofile(${parseInt(actu.authorId)}, '${(actu.authorAvatarUrl || './public/images/defaultAvatar.png')}', '${actu.authorName.replace('(44-BOUAYE)', '').replace('\'', '\\\'')}', false)" >
                                        <h3 class="text-xl font-medium mb-4">${actu.authorName}</h3>
                                    </a>
                                    <p>
                                    ${actu.text ? utils.replaceURLWithHTMLLinks(actu.text.replace(/\n/g, '<br>')) : ''}
                                    ${actuRes}
                                    </p>
                                </div>
                            </div>`;
                        }
                        actuHTML += `</div>`;
                    }

                    //Ajout des mises à jour au DOM
                    let updateHTML = ``;
                    if (course.dernModif.length != 0) {
                        updateHTML += `<ul class="card divide-y divide-gray-100 update-bloc plan-container">`;
                        for (let i = 0; i < course.dernModif.length; i++) {
                            let update = course.dernModif[i];
                            let updateDate = update.date;
                            let resHTML = `<div class="flex space-x-3 text-sm pb-2 mt-1 flex-wrap font-medium"><div class="text-gray-500">`;
                            if (update.res) {
                                for (let j = 0; j < update.res.length; j++) {
                                    let res = update.res[j];
                                    if(res.link !== ''){
                                        resHTML += `<a style="cursor:pointer;" href onclick="viewDoc(event, '${res.link}', '${res.title}')">${res.title}</a>`;
                                        if (j != update.res.length - 1) {
                                            resHTML += `, `;
                                        }
                                    }
                                }
                            }
                            resHTML += `</div></div>`;

                            updateHTML += `
                            <li class="update-item">
                                <div class="flex items-start flex-wrap p-7 sm:space-x-6">
                                <div class="flex-1 sm:order-2">
                                    <a class="text-lg font-semibold">${update.authorName} à ajouter du contenu au cours</a>
                                    ` + resHTML +
                                `
                                    <p class="text-sm text-gray-500">` + (updateDate != null ? (updateDate) : '') + `</p>
                                </div>
                            </li>`;
                        }
                        updateHTML += `</ul><br>`;
                    }

                    //Ajout du plan au DOM
                    let planHTML = ``;
                    if (course.plan.length != 0) {
                        planHTML += `<ul class="card divide-y divide-gray-100 plan-bloc plan-container">`;
                        course.plan = course.plan.reverse();

                        for (let i = 0; i < course.plan.length; i++) {
                            let plan = course.plan[i];
                            planHTML += `
                            <li class="plan-item" ` + (plan.dates ? `onclick="viewPlan('${plan.id}', parseInt(${courseId}))"` : ``) + ` id="${plan.id}">
                                <div class="flex items-center space-x-5 p-7">
                                    <img src="./public/images/courseicon/${utils.courseToIcon(course.courseName)}.png" alt="" class="w-12 h-12 rounded-full">
                                    <div class="flex-1">
                                        <a class="text-lg font-semibold">${plan.title}</a>
                                        <div class="flex space-x-3 text-sm pb-2 mt-1 flex-wrap font-medium"> 
                                            <div class="text-gray-500">${plan.dates || ''}</div>
                                            <div class="text-gray-500">${plan.nbrPlan || ''}</div>
                                        </div>
                                    </div>
                                </div>
                            </li>`;
                        }
                        planHTML += `</ul><br>`;
                    }
                    mainContent.innerHTML = `<h1 class="text-3xl font-semibold text-center">${course.courseName}</h1><br>` + (!(actuHTML == '' && planHTML == '' && updateHTML == '') ? `
                    <nav class="responsive-nav border-b md:m-0 -mx-4 nav-course">
                        <ul style="overflow:hidden;">
                            ` + (actuHTML != '' ? '<li class="active"><a style="cursor:pointer;" class="lg:px-2">Actualitées</a></li>' : '') + `
                            ` + (updateHTML != '' ? '<li ' + (actuHTML == '' ? 'class="active"' : '') + '><a style="cursor:pointer;" class="lg:px-2">Mises à jour</a></li>' : '') + `
                            ` + (planHTML != '' ? '<li ' + (actuHTML == '' && updateHTML == '' ? 'class="active"' : '') + '><a style="cursor:pointer;" class="lg:px-2">Plan</a></li>' : '') + `
                        </ul>
                    </nav><br>` : `<hr><br>`) + (actuHTML == '' && planHTML == '' && updateHTML == '' ? `<h2 class="text-xl  text-center">Aucun contenu dans cet espace de travail </h2>` : actuHTML + planHTML + updateHTML);
                    if (!(actuHTML == '' && planHTML == '' && updateHTML == '')) {
                        let actuBloc = document.querySelector('.actu-bloc');
                        let updateBloc = document.querySelector('.update-bloc');
                        let planBloc = document.querySelector('.plan-bloc');

                        actuHTML == '' ? updateBloc.classList.add('active') : null;
                        updateBloc == '' && actuHTML == '' ? planBloc.classList.add('active') : null;


                        let navCourseLi = document.querySelectorAll('.nav-course li');
                        for (let i = 0; i < navCourseLi.length; i++) {
                            navCourseLi[i].addEventListener('click', function() {
                                for (let j = 0; j < navCourseLi.length; j++) {
                                    navCourseLi[j].classList.remove('active');
                                }
                                this.classList.add('active');

                                if (this.querySelector('a').innerText == 'Actualitées') {
                                    actuBloc ? actuBloc.classList.add('active') : null;
                                    updateBloc ? updateBloc.classList.remove('active') : null;
                                    planBloc ? planBloc.classList.remove('active') : null;
                                } else if (this.querySelector('a').innerText == 'Mises à jour') {
                                    actuBloc ? actuBloc.classList.remove('active') : null;
                                    updateBloc ? updateBloc.classList.add('active') : null;
                                    planBloc ? planBloc.classList.remove('active') : null;
                                } else if (this.querySelector('a').innerText == 'Plan') {
                                    actuBloc ? actuBloc.classList.remove('active') : null;
                                    updateBloc ? updateBloc.classList.remove('active') : null;
                                    planBloc ? planBloc.classList.add('active') : null;
                                }
                            });
                        }
                    }
                }
            }
            window.scroll({
                top: 0,
                left: 0
            });
            if (isforplan) {
                let navCourseLi = document.querySelectorAll('.nav-course li');

                for (let i = 0; i < navCourseLi.length; i++) {
                    if (navCourseLi[i].querySelector('a').innerText == 'Plan') {
                        navCourseLi[i].click();
                    }
                }
            }
            mainContainer.classList.remove('hide');
        })
        .catch(err => {
            console.log(err);
        });
}

function viewPlan(id, courseId) {

    fetch('/api/courses/plan/' + courseId + '/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json()).then(data => {
                if (data.status) {
                    if (data.plan && data.plan.length != 0) {
                        let planItems = document.querySelectorAll('.plan-item');
                        planItems.forEach((item) => {
                            if (item.id != data.planId) {
                                item.remove();
                            } else {
                                item.removeAttribute('onclick')
                                item.removeAttribute('class');
                            }
                        });
                        let planContainer = document.querySelector('.plan-container');
                        document.querySelector('h1').classList.add('flex')
                        document.querySelector('h1').insertAdjacentHTML('afterbegin', `<img class="pr-10 back-plan-btn" style="height:30px;cursor:pointer;" src="./public/images/back.svg">`);
                        document.querySelector('.back-plan-btn').addEventListener('click', () => {
                            mainContainer.classList.add('hide');
                            viewCourse(data.courseId, true);
                        });
                        for (let i = 0; i < data.plan.length; i++) {
                            let planJSON = data.plan[i];
                            let planHTML = `
                                <li class="m-10">
                                    <div class="flex items-start space-x-5 p-7">
                                        <div class="flex-1"><a class="text-lg font-semibold line-clamp-1 mb-1">${planJSON.title}</a>
                                        <p class="text-sm text-gray-400 mb-2">${planJSON.date}</p>
                                        <p class="text-lg leading-6 line-clamp-2 mt-3 description">
                                        ${utils.replaceURLWithHTMLLinks(planJSON.description || '')}${planJSON.res ? (planJSON.res.length != 0 ? `
                                        <hr class="mt-5">
                                        <p class="text-lg font-semibold line-clamp-1 mb-1 mt-5">
                                            Ressource`+(planJSON.res.length > 1 ? 's' : '')+` :</p>` : ``) : ``}`;

                            let planJSONres = planJSON.res ? planJSON.res : [];
                            planJSONres.forEach((res) => {
                                if(res.link !== ''){
                                    planHTML += `<br>
                                        <a style="cursor:pointer;" class="res-link flex text-sm font-semibold" onclick="viewDoc(event, '${res.link}', '${res.title}')">${res.title}&nbsp;&nbsp;&nbsp;
                                            <img class="w-5" src="${res.icon}" alt="">
                                        </a>`;
                                }
                            });
                
                            planHTML += `
                                </p>
                            </div>
                            `+(planJSON.res ? `
                                    <div class="sm:flex items-center space-x-4 hidden">
                                        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                                        </svg>
                                        <span class="text-xl">${planJSON.res.length}</span>
                                    </div>`:``)+`
                                </div>
                            </li>`;
                    planContainer.innerHTML += planHTML;
                }
            }
        }
    })

    let planItems = document.querySelectorAll('.plan-item');

    planItems.forEach((item) => {
        if (item.id != id) {
            item.classList.add('hide');
        }
    });
}

function viewDoc(e, link, title){
    e.preventDefault();
        fetch('/api/courses/getdocurl/'+(link.split('LocationID=').length == 2 ? link.split('LocationID=')[1].split('&')[0]+'/'+link.split('ElementID=')[1].split('&')[0] +'/'+link.split('ElementType=')[1].split('&')[0] : link.split('LearningToolElementId=')[1]), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json()).then(data => {
            if (data.status) {
                
                window.open(data.url.indexOf('resource.itslearning.com') == -1 ? 'https://page.itslearning.com'+data.url : data.url, '_blank');
                // document.body.insertAdjacentHTML('afterbegin',  `
                //     <div class="uk-lightbox uk-overflow-hidden uk-lightbox-panel uk-open uk-active uk-transition-active visualisator-cloud">
                //         <ul class="uk-lightbox-items">
                //             <li class="uk-active uk-transition-active">
                //             <iframe allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="height:100%; width:100%; border:0;" src="${data.url}"></iframe>                        </li>
                //         </ul> 
                //         <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque">
                //             <button class="uk-lightbox-toolbar-icon uk-close-large uk-icon uk-close" type="button" uk-close="" onclick="closeMedia(this)">
                //                 <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="close-large">
                //                     <line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"></line>
                //                     <line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"></line>
                //                 </svg>
                //             </button>   
                //         </div>
                //         <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque">
                //         ${title}
                //         </div>
                //     </div>`);
            }else{
                utils.createModal('Impossible d\'ouvrir le document.', true);
            }
        });
    
   
}