// mainContent = document.querySelector('.main_content .mcontainer');
// let sidebarItemMailbox = document.querySelector('.sidebar_inner ul li:nth-child(6)');

// sidebarItemMailbox.addEventListener('click', function() {
//     mainContent.innerHTML = `
//     <div class="main-area">
//         <div class="main-container">
//             <div class="inbox-container">
//                 <div class="inbox">
//                     <div class="msg anim-y">
//                         <div class="msg-content">
//                         <svg version="1.1" id="Layer_1"  style="height:30px; margin-right:20px;"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
//                             <path style="fill:#211E48;" d="M468.481,451.494h-59.412c-7.906,0-14.317-6.41-14.317-14.317s6.411-14.317,14.317-14.317h59.412
//                             c8.208,0,14.886-6.679,14.886-14.886V104.027c0-8.209-6.679-14.886-14.886-14.886H43.519c-8.208-0.001-14.886,6.677-14.886,14.886
//                             v303.948c0,8.209,6.679,14.886,14.886,14.886h299.562c7.906,0,14.317,6.41,14.317,14.317s-6.411,14.317-14.317,14.317H43.519
//                             C19.523,451.494,0,431.97,0,407.975V104.027C0,80.03,19.523,60.506,43.519,60.506h424.961c23.997,0,43.52,19.523,43.52,43.519
//                             v303.948C512,431.97,492.478,451.494,468.481,451.494z" />
//                             <path style="fill:#B0DACC;" d="M480.552,125.359L271.485,284.769c-9.145,6.974-21.823,6.974-30.968,0L31.448,125.359
//                             c-19.435-14.819-8.955-45.846,15.483-45.846h418.136C489.507,79.513,499.987,110.54,480.552,125.359z" />
//                             <path style="fill:#211E48;" d="M256,304.316c-8.68,0-17.263-2.898-24.165-8.162L22.766,136.743
//                             C8.948,126.206,3.612,108.761,9.174,92.297c5.561-16.464,20.381-27.101,37.758-27.101h418.136c17.377,0,32.198,10.637,37.758,27.101
//                             c5.561,16.464,0.225,33.91-13.594,44.446L280.165,296.154C273.263,301.416,264.68,304.316,256,304.316z M46.931,93.829
//                             c-7.473,0-10.026,5.841-10.63,7.631c-0.604,1.79-2.116,7.983,3.827,12.514l209.069,159.411c1.971,1.503,4.324,2.298,6.803,2.298
//                             c2.478,0,4.832-0.795,6.803-2.298l209.067-159.411c5.943-4.531,4.434-10.723,3.828-12.514c-0.604-1.79-3.158-7.631-10.631-7.631
//                             H46.931z" />
//                             <path style="fill:#B0DACC;" d="M162.942,277.697c0-15.648,17.539-26.735,24.849-39.371c7.542-13.037,8.631-33.687,21.668-41.229
//                             c12.636-7.311,30.892,1.858,46.54,1.858s33.904-9.17,46.54-1.86c13.037,7.542,14.126,28.194,21.668,41.229
//                             c7.311,12.636,24.849,23.723,24.849,39.371s-17.539,26.735-24.849,39.371c-7.542,13.037-8.631,33.687-21.668,41.229
//                             c-12.636,7.311-30.892-1.858-46.54-1.858s-33.904,9.17-46.54,1.86c-13.037-7.542-14.126-28.194-21.668-41.229
//                             C180.482,304.432,162.942,293.345,162.942,277.697z" />
//                             <path style="fill:#211E48;" d="M290.559,375.442c-6.795,0-13.412-1.317-19.813-2.593c-5.409-1.078-10.52-2.096-14.746-2.096
//                             c-4.226,0-9.336,1.018-14.746,2.096c-6.4,1.274-13.017,2.593-19.81,2.593c-7.36,0-13.625-1.555-19.153-4.753
//                             c-13.1-7.579-17.846-21.808-21.66-33.243c-1.686-5.059-3.281-9.837-5.231-13.208c-1.805-3.121-5.045-6.72-8.474-10.53
//                             c-8.153-9.061-18.301-20.337-18.301-36.01s10.146-26.949,18.299-36.01c3.43-3.811,6.669-7.41,8.474-10.53
//                             c1.951-3.372,3.545-8.15,5.231-13.21c3.814-11.433,8.56-25.664,21.658-33.243c5.528-3.198,11.793-4.753,19.153-4.753
//                             c6.793,0,13.41,1.317,19.81,2.593c5.41,1.077,10.521,2.094,14.747,2.094c4.226,0,9.336-1.018,14.747-2.094
//                             c6.4-1.274,13.017-2.593,19.81-2.593c7.36,0,13.625,1.555,19.153,4.753c13.1,7.579,17.847,21.81,21.66,33.244
//                             c1.688,5.058,3.281,9.837,5.231,13.208c1.804,3.12,5.042,6.719,8.473,10.528c8.153,9.061,18.301,20.335,18.301,36.01
//                             s-10.148,26.949-18.301,36.01c-3.43,3.811-6.669,7.41-8.474,10.53c-1.948,3.37-3.543,8.148-5.228,13.207
//                             c-3.814,11.435-8.56,25.667-21.661,33.246C304.181,373.887,297.917,375.442,290.559,375.442z M256,342.121
//                             c7.049,0,13.807,1.346,20.34,2.647c5.27,1.049,10.246,2.04,14.218,2.04c2.188,0,3.762-0.296,4.813-0.903
//                             c3.711-2.147,6.434-10.314,8.838-17.519c2.064-6.193,4.201-12.596,7.606-18.487c3.304-5.711,7.712-10.609,11.974-15.346
//                             c5.384-5.983,10.951-12.169,10.951-16.856c0-4.687-5.568-10.873-10.951-16.856c-4.263-4.737-8.672-9.635-11.973-15.344
//                             c-3.409-5.891-5.543-12.294-7.609-18.487c-2.402-7.206-5.127-15.373-8.836-17.519c-1.051-0.608-2.626-0.903-4.813-0.903
//                             c-3.97,0-8.948,0.991-14.218,2.04c-6.533,1.301-13.29,2.647-20.34,2.647s-13.805-1.346-20.34-2.647
//                             c-5.27-1.049-10.248-2.04-14.218-2.04c-2.188,0-3.762,0.296-4.815,0.903c-3.708,2.146-6.432,10.312-8.835,17.516
//                             c-2.066,6.195-4.202,12.599-7.611,18.491c-3.303,5.709-7.711,10.607-11.973,15.344c-5.383,5.983-10.951,12.169-10.951,16.856
//                             c0,4.689,5.568,10.875,10.951,16.858c4.263,4.737,8.67,9.634,11.974,15.345c3.409,5.891,5.545,12.295,7.609,18.49
//                             c2.404,7.206,5.127,15.372,8.836,17.518c1.051,0.608,2.626,0.903,4.813,0.903c3.969,0,8.948-0.991,14.218-2.042
//                             C242.195,343.466,248.951,342.121,256,342.121z" />
//                             </svg>
//                             <div class="msg-title">Boîte de récéption</div>
//                         </div>
//                     </div>
//                     <div class="msg anim-y">
//                         <div class="msg-content">
//                             <div class="msg-title">Favoris</div>
//                         </div>
//                     </div>
//                     <div class="msg anim-y">
//                         <div class="msg-content">
//                             <div class="msg-title">Brouillons</div>
//                         </div>
//                     </div>
//                     <div class="msg anim-y">
//                         <div class="msg-content">
//                             <div class="msg-title">Messages envoyés</div>
//                         </div>
//                     </div>
//                     <div class="msg anim-y">
//                         <div class="msg-content">
//                             <div class="msg-title">Corbeille</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="mail-detail">
//                 <div class="mail-detail-header">
//                     <div class="mail-detail-profile">
//                         <img src="" alt="" class="members inbox-detail">
//                         <div class="mail-detail-name">Sou - Rufus</div>
//                     </div>
//                     <div class="mail-icons">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
//                             <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path>
//                         </svg>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
//                             <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
//                             <circle cx="12" cy="7" r="4"></circle>
//                         </svg>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag">
//                             <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"></path>
//                         </svg>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square">
//                             <path d="M9 11l3 3L22 4"></path>
//                             <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
//                         </svg>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
//                             <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
//                         </svg>
//                     </div>
//                 </div>
//                 <div class="mail-contents">
//                     <div class="mail">
//                         <div class="mail-time">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock">
//                                 <circle cx="12" cy="12" r="10"></circle>
//                                 <path d="M12 6v6l4 2"></path>
//                             </svg>
//                             12 Mar, 2019
//                         </div>
//                         <div class="mail-inside">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce accumsan commodo lectus gravida dictum. Aliquam a dui eu arcu hendrerit porta sed in velit. Fusce eu semper magna. Aenean porta facilisis neque, ac dignissim magna vestibulum eu. Etiam id ligula eget neque placerat ultricies in sed neque. Nam vitae rutrum est. Etiam non condimentum ante, eu consequat orci. Aliquam a dui eu arcu hendrerit porta sed in velit. Fusce eu semper magna.</div>
//                         <div class="mail-doc">
//                             <div class="mail-doc-wrapper">
//                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
//                                     <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
//                                     <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"></path>
//                                 </svg>
//                                 <div class="mail-doc-detail">
//                                     <div class="mail-doc-name">Article.docx</div>
//                                     <div class="mail-doc-date">added 17 May, 2020</div>
//                                 </div>
//                             </div>
//                             <div class="mail-doc-icons">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
//                                     <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path>
//                                 </svg>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download-cloud">
//                                     <path d="M8 17l4 4 4-4M12 12v9"></path>
//                                     <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
//                                 </svg>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="mail-textarea">
//                     <input type="text" placeholder="Write a comment...">
//                     <div class="textarea-icons">
//                         <div class="attach">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
//                                 <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
//                             </svg>
//                         </div>
//                         <div class="send">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send">
//                                 <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//    </div>`;



//     mainContainer.classList.remove('hide');
// });