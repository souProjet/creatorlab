let sidebarItemTool;
sidebarItems.forEach((item) => {
    if (item.querySelector('span').innerHTML === 'Les outils') {
        sidebarItemTool = item;
    }
});

sidebarItemTool.addEventListener('click', function() {

    //title
    mainContent.innerHTML =
        `<div class="flex justify-between items-center relative md:mb-4 mb-3">
            <div class="flex-1">
                <h2 class="text-2xl font-semibold">Voici une liste d'outils séléctionné pour vous par catégorie</h2>  
            </div>  
        </div>`;

    //prise de note et organisation
    mainContent.innerHTML += `
        <div class="my-6 flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold">Prise de note et organisation</h2>
            </div>
        </div>`;

    mainContent.innerHTML +=
        `<div class="relative uk-slider" uk-slider="finite: true">       
            <div class="uk-slider-container px-1 py-3">
                <ul class="uk-slider-items uk-child-width-1-5@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid" style="transform: translate3d(0px, 0px, 0px);">
                    <li tabindex="-1" >
                        <a href="https://notion.so/fr-fr" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/notion.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Notion</div>
                                </div>
                            </div>
                        </a>
                    </li>  
                    <li tabindex="-1" >
                        <a href="https://trello.com/fr" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/trello.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Trello</div>
                                </div>
                            </div>
                        </a>
                    </li>  
                    <li tabindex="-1" >
                        <a href="https://play.google.com/store/apps/details?hl=fr&gl=fr&id=com.evernote" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/evernote.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Evernote</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://www.microsoft.com/fr-fr/microsoft-365/onenote/digital-note-taking-app" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/onenote.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Microsoft OneNote</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://play.google.com/store/apps/details?id=com.microsoft.office.officelens&hl=fr&gl=US" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/lens.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Microsoft Office Lens</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://play.google.com/store/apps/details?hl=fr&gl=fr&id=com.todoist" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/todoist.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Todoist</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://keep.google.com" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/googlekeep.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Google Keep</div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
        
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible" href="#" uk-slider-item="previous"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-previous"><polyline fill="none" stroke="#000" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23 "></polyline></svg></a>
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white" href="#" uk-slider-item="next"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-next"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1 "></polyline></svg></a>
        
            </div>
        </div>`;

    // modification d'image et de video
    mainContent.innerHTML += `
        <div class="my-6 flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold">Modification d'image et de vidéo</h2>
            </div>
        </div>`;

    mainContent.innerHTML +=
        `<div class="relative uk-slider" uk-slider="finite: true">       
            <div class="uk-slider-container px-1 py-3">
                <ul class="uk-slider-items uk-child-width-1-5@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid" style="transform: translate3d(0px, 0px, 0px);">
                    <li tabindex="-1" >
                        <a href="https://fotoram.io/fr" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/fotoramio.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Fotoramio</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://pixlr.com/fr/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/pixlr.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Pixlr</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://www.canva.com/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/canva.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Canva</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://clipchamp.com/fr/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/clipchamp.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Clipchamp</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://clideo.com/fr/tools" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/clideo.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Clideo</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://cleanup.pictures/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/cleanup.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Cleaup.pictures</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://www.remove.bg/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/removebg.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Remove.bg</div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>

                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible" href="#" uk-slider-item="previous"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-previous"><polyline fill="none" stroke="#000" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23 "></polyline></svg></a>
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white" href="#" uk-slider-item="next"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-next"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1 "></polyline></svg></a>

            </div>
        </div>`;

    //IA et génération 
    mainContent.innerHTML += `
    <div class="my-6 flex items-center justify-between">
        <div>
            <h2 class="text-xl font-semibold">IA et génération</h2>
        </div>
    </div>`;

    mainContent.innerHTML +=
        `<div class="relative uk-slider" uk-slider="finite: true">       
            <div class="uk-slider-container px-1 py-3">
                <ul class="uk-slider-items uk-child-width-1-5@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid" style="transform: translate3d(0px, 0px, 0px);">
                    <li tabindex="-1" >
                        <a href="https://autostudy.divertixme.com" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/autostudy.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Autostudy</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://docopilot.divertixme.com" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/docopilot.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Docopilot</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://app.cedille.ai/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/cedille.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Cedille</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://quillbot.com/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/quillbot.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Quillbot</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://zyro.com/fr/ai" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/zyro.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Zyro</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://rytr.me/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/rytr.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Rytr</div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible" href="#" uk-slider-item="previous"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-previous"><polyline fill="none" stroke="#000" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23 "></polyline></svg></a>
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white" href="#" uk-slider-item="next"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-next"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1 "></polyline></svg></a>
            </div>
        </div>`;


    //Autre outils
    mainContent.innerHTML += `
        <div class="my-6 flex items-center justify-between">
            <div>
                <h2 class="text-xl font-semibold">Autre outils</h2>
            </div>
        </div>`;

    mainContent.innerHTML +=
        `<div class="relative uk-slider" uk-slider="finite: true">       
            <div class="uk-slider-container px-1 py-3">
                <ul class="uk-slider-items uk-child-width-1-5@m uk-child-width-1-3@s uk-child-width-1-2 uk-grid-small uk-grid" style="transform: translate3d(0px, 0px, 0px);">
                    <li tabindex="-1" >
                        <a href="https://convertio.co/fr/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/convertio.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Convertio</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://notube.io/fr/youtube-app-v19" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/notube.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Notube</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://10minemail.com/fr/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/10minemail.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">10 Minutes Email</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://www.mathway.com/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/mathway.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Mathway</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://flag.creatorlab.com/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/flagcreator.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Flagcreator</div>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li tabindex="-1" >
                        <a href="https://color.adobe.com/fr/" target="_blank">
                            <div class="card">
                                <div class="card-media h-40">
                                    <img src="./public/images/toolicon/coloradobe.png" alt="">
                                </div>
                                <div class="card-body">                                
                                    <div class="ext-lg font-medium mt-1 t truncate">Adobe Color</div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -left-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white uk-invisible" href="#" uk-slider-item="previous"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-previous"><polyline fill="none" stroke="#000" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23 "></polyline></svg></a>
                <a class="absolute bg-white bottom-1/2 flex items-center justify-center p-2 -right-4 rounded-full shadow-md text-xl w-9 z-10 dark:bg-gray-800 dark:text-white" href="#" uk-slider-item="next"><svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg" data-svg="slidenav-next"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1 "></polyline></svg></a>
            </div>
        </div>`;



    mainContainer.classList.remove('hide');
});