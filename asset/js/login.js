let loginBtn = document.querySelector('button')
let form = document.querySelector('form')
let errorSpan = document.querySelector('.error-span');
let username = document.querySelector('input[type="text"]');
let password = document.querySelector('input[type="password"]');

loginBtn.addEventListener('click', () => {
    loginBtn.innerHTML = 'récupération des informations <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
    if (username.value.length > 0 && password.value.length > 0) {
        fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    loginBtn.innerHTML = 'Connexion réussite';
                    errorSpan.innerHTML = '';
                    window.location.href = '/';
                } else {

                    loginBtn.innerHTML = 'Connexion';
                    errorSpan.innerHTML = data.message;
                }
            })
            .catch(err => {
                loginBtn.innerHTML = 'Connexion';
                errorSpan.innerHTML = 'Une erreur est survenue';
            })
    } else {
        loginBtn.innerHTML = 'Connexion';
        errorSpan.innerHTML = 'Veuillez remplir tous les champs';
    }
    setTimeout(() => {
        loginBtn.innerHTML = 'Connexion à E-lyco <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
        setTimeout(() => {
            loginBtn.innerHTML = 'récupération des cookies <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
            setTimeout(() => {
                loginBtn.innerHTML = 'connexion à Pronote <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
                setTimeout(() => {
                    loginBtn.innerHTML = 'récupération du planning <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
                    setTimeout(() => {
                        loginBtn.innerHTML = 'récupération des notes <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
                    }, 3000);
                }, 4000);
            }, 6000);
        }, 4000);
    }, 3000);
});
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});