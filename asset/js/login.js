document.cookie.indexOf('token') != -1 ? window.location = '/' : null;

let loginBtn = document.querySelector('button')
let errorSpan = document.querySelector('.error-span');
let username = document.querySelector('input[type="text"]');
let password = document.querySelector('input[type="password"]');

loginBtn.addEventListener('click', () => {
    initMorpion();
    loginBtn.innerHTML = 'Connexion <img class="loader-waiting"  src="./public/images/loader-waiting.svg">';
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
                    loginBtn.innerHTML = 'Connexion réussie';
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
});
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});