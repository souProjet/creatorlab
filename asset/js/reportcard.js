let sidebarItemReportcard;
sidebarItems.forEach((item) => {
    if (item.querySelector('span').innerHTML === 'Mon bulletin') {
        sidebarItemReportcard = item;
    }
});

sidebarItemReportcard.addEventListener('click', function() {
            let navBarMatters = ``;
            for (let i = 0; i < reportcard.matters.length; i++) {
                navBarMatters += `
        <li onclick="showNoteForMatter(this, ${i})" class="${i == 0 ? `active` : ``}">
            <a  class="lg:px-2">
                ${reportcard.matters[i].name}
                <span>${reportcard.matters[i].mean.toString().replace('.', ',')}</span>
            </a>
        </li>`;
            }


    let testHTML = ``;

    for(let i = 0; i < reportcard.matters[0].evaluation.length; i++) {
        let test = reportcard.matters[0].evaluation[i];
        let testBefore = i == reportcard.matters[0].evaluation.length - 1 ? null : reportcard.matters[0].evaluation[i+1];

        let offset_mean = 4;
        let dist_mean = Math.round((test.student - test.class) * -100) / -100;
        dist_mean > offset_mean ? dist_mean = offset_mean : dist_mean < -offset_mean ? dist_mean = -offset_mean : dist_mean = dist_mean;
        let g_mean = Math.floor(((dist_mean + offset_mean) * 256 / (offset_mean * 2)) - 1);
        let r_mean = Math.floor(256 - ((dist_mean + offset_mean) * 256 / (offset_mean * 2)));

        testHTML += `
        <div class="flex items-center space-x-4 py-3 hover:bg-gray-100 rounded-md -mx-2 px-2">
            <div class="w-14 h-14 flex-shrink-0 rounded-md relative"> 
            `+(test.student == null ? `
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
                <path style="fill:#344240;" d="M482,232c0,128-104,232-232,232S18,360,18,232S122,0,250,0C378,0,482,104,482,232z" />
                <path style="fill:#121C1B;" d="M250,0c128,0,232,104,232,232S378,464,250,464" />
                <path style="fill:#273533;" d="M86,68c90.4-90.4,237.6-90.4,328,0s90.4,237.6,0,328" />
                <path style="opacity:0.2;fill:#616F70;enable-background:new    ;" d="M450.8,374.4l-97.6-96.8l97.6-97.6
                c14.4-14.4,21.6-32.8,21.6-52c0-18.4-7.2-37.6-21.6-52c-28.8-28.8-74.4-28.8-103.2,0L250,173.6l-97.6-96.8C123.6,48,78,48,49.2,76.8
                s-28.8,74.4,0,103.2l97.6,97.6l-97.6,96.8c-28.8,28.8-28.8,74.4,0,103.2c28.8,28.8,74.4,28.8,103.2,0l97.6-96.8l97.6,97.6
                c14.4,14.4,32.8,21.6,52,21.6c18.4,0,37.6-7.2,52-21.6C479.6,449.6,479.6,403.2,450.8,374.4z" />
                <path style="fill:#EF0770;" d="M450.8,320l-97.6-97.6l97.6-97.6c14.4-14.4,21.6-32.8,21.6-52c0-18.4-7.2-37.6-21.6-52
                C422-6.4,376.4-6.4,347.6,21.6L250,119.2l-97.6-97.6c-28-28-74.4-28-103.2,0c-28.8,28.8-28.8,74.4,0,103.2l97.6,97.6L49.2,320
                c-28.8,28.8-28.8,74.4,0,103.2s74.4,28.8,103.2,0l97.6-97.6l97.6,97.6c14.4,14.4,32.8,21.6,52,21.6c18.4,0,37.6-7.2,52-21.6
                C479.6,394.4,479.6,348.8,450.8,320z" />
                <path style="fill:#FF7895;" d="M459.6,331.2c-2.4-4-5.6-7.2-8.8-11.2l-97.6-97.6l97.6-97.6c0.8-0.8,2.4-2.4,3.2-4
                c-24-44-60.8-79.2-106.4-100l0,0L250,119.2l-97.6-97.6l0,0C106.8,42.4,70,77.6,46,121.6c0.8,1.6,2.4,2.4,3.2,4l97.6,97.6L49.2,320
                c-3.2,3.2-6.4,7.2-8.8,11.2c20.8,44,55.2,80,96.8,104c5.6-3.2,10.4-7.2,15.2-11.2l97.6-98.4l97.6,97.6c4.8,4.8,9.6,8.8,15.2,11.2
                C405.2,411.2,438.8,375.2,459.6,331.2z" />
            </svg>` : (testBefore ? ((Math.round((test.student / test.of * 20)*-100)/-100 > Math.round((testBefore.student / testBefore.of * 20)*-100) / -100) ? (
                (Math.round((test.student / test.of * 20)*-100)/-100 == Math.round((testBefore.student / testBefore.of * 20)*-100) / -100) ? `
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" style="enable-background:new 0 0 42 42;" xml:space="preserve">
                    <path style="fill:#7383BF;" d="M37.059,8H26H16H4.941C2.224,8,0,10.282,0,13s2.224,5,4.941,5H16h10h11.059
                    C39.776,18,42,15.718,42,13S39.776,8,37.059,8z" />
                    <path style="fill:#7383BF;" d="M37.059,24H26H16H4.941C2.224,24,0,26.282,0,29s2.224,5,4.941,5H16h10h11.059
                    C39.776,34,42,31.718,42,29S39.776,24,37.059,24z" />
                </svg>
                ` : `
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 325.498 325.498" style="enable-background:new 0 0 325.498 325.498;" xml:space="preserve">
                <g>
                    <g id="Layer_5_45_" fill="green">
                        <g>
                            <g>
                                <path d="M104.998,289.047c0,8.25-6.75,15-15,15h-62c-8.25,0-15-6.75-15-15v-68c0-8.25,6.75-15,15-15h62c8.25,0,15,6.75,15,15
                                V289.047z" />
                            </g>
                            <g>
                                <path d="M215.248,289.047c0,8.25-6.75,15-15,15h-62c-8.25,0-15-6.75-15-15v-104c0-8.25,6.75-15,15-15h62c8.25,0,15,6.75,15,15
                                V289.047z" />
                            </g>
                            <g>
                                <path d="M325.498,289.047c0,8.25-6.75,15-15,15h-62c-8.25,0-15-6.75-15-15v-144c0-8.25,6.75-15,15-15h62c8.25,0,15,6.75,15,15
                                V289.047z" />
                            </g>
                            <path d="M312.522,21.731l-67.375,16.392c-5.346,1.294-6.537,5.535-2.648,9.424l14.377,14.041
                            c1.207,1.376-0.225,3.206-1.361,3.981c-9.053,6.18-23.42,15.248-43.279,25.609c-108.115,56.407-197.238,52.947-198.578,52.886
                            c-7.154-0.363-13.271,5.148-13.641,12.314c-0.369,7.17,5.143,13.283,12.313,13.652c0.527,0.027,2.67,0.124,6.273,0.124
                            c23.107,0,106.111-3.987,205.66-55.924c23.555-12.289,39.881-22.888,49.414-29.598c1.348-0.949,3.697-2.585,5.865-0.378
                            l15.725,15.724c3.889,3.889,8.109,2.692,9.381-2.659l15.285-68.211C321.203,23.756,317.867,20.437,312.522,21.731z" />
                        </g>
                    </g>
                </g>
            </svg>
            `) : `
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
                <g fill="red">
                    <g>
                        <path d="M41.19,500.53h23.696c9.051,0,16.395-7.34,16.395-16.396c0-9.051-7.339-16.395-16.395-16.395H41.19v-73.22h23.696
                        c9.051,0,16.395-7.34,16.395-16.396c0-9.051-7.339-16.395-16.395-16.395H41.19v-73.215h23.696c9.051,0,16.395-7.339,16.395-16.395
                        c0-9.051-7.339-16.395-16.395-16.395H41.19v-73.22h23.696c9.051,0,16.395-7.339,16.395-16.395s-7.339-16.395-16.395-16.395H41.19
                        V76.5h23.696c9.056,0,16.395-7.339,16.395-16.395S73.942,43.71,64.886,43.71H41.19V0H0v570.81V612l0,0h41.19l0,0H612v-41.19H41.19
                        V500.53z" />
                        <polygon points="515.944,406.406 515.944,535.5 592.444,535.5 592.444,454.219 		" />
                        <polygon points="390.265,325.125 390.265,535.5 466.765,535.5 466.765,372.938 		" />
                        <polygon points="264.59,243.844 264.59,535.5 341.09,535.5 341.09,296.438 		" />
                        <polygon points="215.41,215.156 138.91,167.344 138.91,535.5 215.41,535.5 		" />
                        <polygon points="529.495,257.355 167.812,6.436 142.51,42.926 502.395,292.569 473.659,329.906 612,348.31 558.78,219.302 		" />
                    </g>
                </g>
            </svg>
            `) : `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="blue" d="M21.71,3.29a1,1,0,0,0-1.42,0l-18,18a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l18-18A1,1,0,0,0,21.71,3.29Z" />
            </svg>
            `))+`
            </div>
            <div class="flex-1">
                <a class="text-lg font-semibold capitalize">Vous : `+(test.student == null ? "non noté" : `<span style="color:rgb(`+r_mean+`,`+g_mean+`, 0);">${test.student.toString().replace('.', ',')} / <small>${test.of}</small></span>`)+` - <small>Classe : ${test.class.toString().replace('.', ',')}/${test.of}</small></a>
                <div class="text-sm text-gray-500 mt-0.5">${test.date}</div>
            </div>
        </div>
        `;
    }

    mainContent.innerHTML = `
    <div class="lg:w-full"> 
        <h3 class="text-xl font-semibold">Vos notes pour ce trimestre :</h3>
        <nav class="responsive-nav border-b">
            <ul class="reportcard-nav">
                `+navBarMatters+`
            </ul>
        </nav>
        <div class="grid md:grid-cols-2 divide divide-gray-200 gap-x-4 mt-4 repordcard-note">
                `+testHTML+`
        </div> 
    </div>`;

    mainContainer.classList.remove('hide');
});

function showNoteForMatter(element, matterId){
    element.parentNode.querySelector('.active').classList.remove('active');
    element.classList.add('active');

    let testHTML = ``;

    for(let i = 0; i < reportcard.matters[matterId].evaluation.length; i++) {
        let test = reportcard.matters[matterId].evaluation[i];
        let testBefore = i == reportcard.matters[matterId].evaluation.length - 1 ? null : reportcard.matters[matterId].evaluation[i+1];
        let offset_mean = 4;
        let dist_mean = Math.round((test.student - test.class) * -100) / -100;
        dist_mean > offset_mean ? dist_mean = offset_mean : dist_mean < -offset_mean ? dist_mean = -offset_mean : dist_mean = dist_mean;
        let g_mean = Math.floor(((dist_mean + offset_mean) * 256 / (offset_mean * 2)) - 1);
        let r_mean = Math.floor(256 - ((dist_mean + offset_mean) * 256 / (offset_mean * 2)));
        testHTML += `
        <div class="flex items-center space-x-4 py-3 hover:bg-gray-100 rounded-md -mx-2 px-2">
            <div class="w-14 h-14 flex-shrink-0 rounded-md relative"> 
            `+(test.student == null ? `
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
                <path style="fill:#344240;" d="M482,232c0,128-104,232-232,232S18,360,18,232S122,0,250,0C378,0,482,104,482,232z" />
                <path style="fill:#121C1B;" d="M250,0c128,0,232,104,232,232S378,464,250,464" />
                <path style="fill:#273533;" d="M86,68c90.4-90.4,237.6-90.4,328,0s90.4,237.6,0,328" />
                <path style="opacity:0.2;fill:#616F70;enable-background:new    ;" d="M450.8,374.4l-97.6-96.8l97.6-97.6
                c14.4-14.4,21.6-32.8,21.6-52c0-18.4-7.2-37.6-21.6-52c-28.8-28.8-74.4-28.8-103.2,0L250,173.6l-97.6-96.8C123.6,48,78,48,49.2,76.8
                s-28.8,74.4,0,103.2l97.6,97.6l-97.6,96.8c-28.8,28.8-28.8,74.4,0,103.2c28.8,28.8,74.4,28.8,103.2,0l97.6-96.8l97.6,97.6
                c14.4,14.4,32.8,21.6,52,21.6c18.4,0,37.6-7.2,52-21.6C479.6,449.6,479.6,403.2,450.8,374.4z" />
                <path style="fill:#EF0770;" d="M450.8,320l-97.6-97.6l97.6-97.6c14.4-14.4,21.6-32.8,21.6-52c0-18.4-7.2-37.6-21.6-52
                C422-6.4,376.4-6.4,347.6,21.6L250,119.2l-97.6-97.6c-28-28-74.4-28-103.2,0c-28.8,28.8-28.8,74.4,0,103.2l97.6,97.6L49.2,320
                c-28.8,28.8-28.8,74.4,0,103.2s74.4,28.8,103.2,0l97.6-97.6l97.6,97.6c14.4,14.4,32.8,21.6,52,21.6c18.4,0,37.6-7.2,52-21.6
                C479.6,394.4,479.6,348.8,450.8,320z" />
                <path style="fill:#FF7895;" d="M459.6,331.2c-2.4-4-5.6-7.2-8.8-11.2l-97.6-97.6l97.6-97.6c0.8-0.8,2.4-2.4,3.2-4
                c-24-44-60.8-79.2-106.4-100l0,0L250,119.2l-97.6-97.6l0,0C106.8,42.4,70,77.6,46,121.6c0.8,1.6,2.4,2.4,3.2,4l97.6,97.6L49.2,320
                c-3.2,3.2-6.4,7.2-8.8,11.2c20.8,44,55.2,80,96.8,104c5.6-3.2,10.4-7.2,15.2-11.2l97.6-98.4l97.6,97.6c4.8,4.8,9.6,8.8,15.2,11.2
                C405.2,411.2,438.8,375.2,459.6,331.2z" />
            </svg>` : (testBefore ? ((Math.round((test.student / test.of * 20)*-100)/-100 > Math.round((testBefore.student / testBefore.of * 20)*-100) / -100) ? (
                (Math.round((test.student / test.of * 20)*-100)/-100 == Math.round((testBefore.student / testBefore.of * 20)*-100) / -100) ? `
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" style="enable-background:new 0 0 42 42;" xml:space="preserve">
                    <path style="fill:#7383BF;" d="M37.059,8H26H16H4.941C2.224,8,0,10.282,0,13s2.224,5,4.941,5H16h10h11.059
                    C39.776,18,42,15.718,42,13S39.776,8,37.059,8z" />
                    <path style="fill:#7383BF;" d="M37.059,24H26H16H4.941C2.224,24,0,26.282,0,29s2.224,5,4.941,5H16h10h11.059
                    C39.776,34,42,31.718,42,29S39.776,24,37.059,24z" />
                </svg>
                ` : `
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 325.498 325.498" style="enable-background:new 0 0 325.498 325.498;" xml:space="preserve">
                <g>
                    <g id="Layer_5_45_" fill="green">
                        <g>
                            <g>
                                <path d="M104.998,289.047c0,8.25-6.75,15-15,15h-62c-8.25,0-15-6.75-15-15v-68c0-8.25,6.75-15,15-15h62c8.25,0,15,6.75,15,15
                                V289.047z" />
                            </g>
                            <g>
                                <path d="M215.248,289.047c0,8.25-6.75,15-15,15h-62c-8.25,0-15-6.75-15-15v-104c0-8.25,6.75-15,15-15h62c8.25,0,15,6.75,15,15
                                V289.047z" />
                            </g>
                            <g>
                                <path d="M325.498,289.047c0,8.25-6.75,15-15,15h-62c-8.25,0-15-6.75-15-15v-144c0-8.25,6.75-15,15-15h62c8.25,0,15,6.75,15,15
                                V289.047z" />
                            </g>
                            <path d="M312.522,21.731l-67.375,16.392c-5.346,1.294-6.537,5.535-2.648,9.424l14.377,14.041
                            c1.207,1.376-0.225,3.206-1.361,3.981c-9.053,6.18-23.42,15.248-43.279,25.609c-108.115,56.407-197.238,52.947-198.578,52.886
                            c-7.154-0.363-13.271,5.148-13.641,12.314c-0.369,7.17,5.143,13.283,12.313,13.652c0.527,0.027,2.67,0.124,6.273,0.124
                            c23.107,0,106.111-3.987,205.66-55.924c23.555-12.289,39.881-22.888,49.414-29.598c1.348-0.949,3.697-2.585,5.865-0.378
                            l15.725,15.724c3.889,3.889,8.109,2.692,9.381-2.659l15.285-68.211C321.203,23.756,317.867,20.437,312.522,21.731z" />
                        </g>
                    </g>
                </g>
            </svg>
            `) : `
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
                <g fill="red">
                    <g>
                        <path d="M41.19,500.53h23.696c9.051,0,16.395-7.34,16.395-16.396c0-9.051-7.339-16.395-16.395-16.395H41.19v-73.22h23.696
                        c9.051,0,16.395-7.34,16.395-16.396c0-9.051-7.339-16.395-16.395-16.395H41.19v-73.215h23.696c9.051,0,16.395-7.339,16.395-16.395
                        c0-9.051-7.339-16.395-16.395-16.395H41.19v-73.22h23.696c9.051,0,16.395-7.339,16.395-16.395s-7.339-16.395-16.395-16.395H41.19
                        V76.5h23.696c9.056,0,16.395-7.339,16.395-16.395S73.942,43.71,64.886,43.71H41.19V0H0v570.81V612l0,0h41.19l0,0H612v-41.19H41.19
                        V500.53z" />
                        <polygon points="515.944,406.406 515.944,535.5 592.444,535.5 592.444,454.219 		" />
                        <polygon points="390.265,325.125 390.265,535.5 466.765,535.5 466.765,372.938 		" />
                        <polygon points="264.59,243.844 264.59,535.5 341.09,535.5 341.09,296.438 		" />
                        <polygon points="215.41,215.156 138.91,167.344 138.91,535.5 215.41,535.5 		" />
                        <polygon points="529.495,257.355 167.812,6.436 142.51,42.926 502.395,292.569 473.659,329.906 612,348.31 558.78,219.302 		" />
                    </g>
                </g>
            </svg>
            `) : `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="blue" d="M21.71,3.29a1,1,0,0,0-1.42,0l-18,18a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l18-18A1,1,0,0,0,21.71,3.29Z" />
            </svg>
            `))+`
            </div>
            <div class="flex-1">
                <a class="text-lg font-semibold capitalize">Vous : `+(test.student == null ? "non noté" : `<span style="color:rgb(`+r_mean+`,`+g_mean+`, 0);">${test.student.toString().replace('.', ',')} / <small>${test.of}</small></span>`)+` - <small>Classe : ${test.class.toString().replace('.', ',')}/${test.of}</small></a>
                <div class="text-sm text-gray-500 mt-0.5">${test.date}</div>
            </div>
        </div>
        `;
        }


    document.querySelector('.repordcard-note').innerHTML = testHTML;
}