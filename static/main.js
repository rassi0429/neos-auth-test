

// Replace with your cloud functions location
const functionLocation = 'asia-northeast1';

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

// document
//     .getElementById('signout')
//     .addEventListener('click', () => firebase.auth().signOut());

function handleCustomLogin(token) {
    console.log(token)
    firebase.auth().signInWithCustomToken(token).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
        // ...
    });
}

function handleTokenLogin() {
    const token = document.getElementById("token").value;
    console.log(token)
    fetch("https://auth.kokopi.me/token?token=" + token).then(
        async (res) => {
            const result = await res.json()
            if (result.success) {
                console.log(result)
                handleCustomLogin(result.token)
            } else {
                location.reload()
            }
        })
}

function handleLogout() {
    firebase.auth().signOut()
}

function handleLoginRequest() {
    const userId = document.getElementById("userid").value;
    fetch("https://auth.kokopi.me/userId?userId=" + userId).then(
        async (res) => {
            const result = await res.json()
            if (result.success) {
                //hide login form
                document.getElementById("login").style.display = "none"
                // show token form
                document.getElementById("token-form").style.display = "block"
            }
        })
}

firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        console.log("login")
        document.getElementById("login").style.display = "none"
        document.getElementById("token-form").style.display = "none"
        document.getElementById("loggedin").style.display = "block"

        document.getElementById("useridfield").innerText = firebaseUser.uid
    } else {
        console.log("not login")
        document.getElementById("login").style.display = "block"
        document.getElementById("token-form").style.display = "none"
        document.getElementById("loggedin").style.display = "none"
    }
});