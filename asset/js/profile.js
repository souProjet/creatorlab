let mainContent = document.querySelector('.main_content .mcontainer');

function randomGradientBackground() {
    let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    let randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
    let gradient = `linear-gradient(to right, ${randomColor} 0%, ${randomColor2} 100%)`;
    return gradient;
}
socket.on('profile', data => {
    if (data.status) {
        if (data.profile) {
            let profile = data.profile;
            let items = ``;
            if (profile.profile[0] && profile.profile[0].items) {
                profile.profile[0].items.forEach(item => {
                    items += `<li>${item}</li>`
                });
            }
            mainContent.innerHTML = `
            <div class="profile user-profile">
                    <div class="profiles_banner" style="background:${randomGradientBackground()};">
                    </div>
                    <div class="profiles_content">

                        <div class="profile_avatar">
                            <div class="profile_avatar_holder"> 
                                <img src="${profile.avatar}" alt="">
                            </div>
                            <!--<div class="user_status status_online"></div>-->
                        </div>

                        <div class="profile_info">
                            <h1>${profile.name}</h1>
                            <p>` + (profile.profile[0] ? profile.profile[0].text : '') + (items ? items : '') + `<br>` + (profile.profile[1] ? profile.profile[1].text : '') + `<br>` + (profile.profile[2] ? profile.profile[2].text : '') + `</p>
                        </div>
                    </div>
                </div>`
            mainContainer.classList.remove('hide');
            sidebarItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }

});