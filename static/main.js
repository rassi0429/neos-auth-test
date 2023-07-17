const functionLocation = 'asia-northeast1';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

// ユーザーIDを送って、認証コードをもらう
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

// 認証コードを送って、tokenをもらう
function handleTokenLogin() {
    const token = document.getElementById("token").value;
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

// バックエンドからもらってきたtokenを使ってログインする
function handleCustomLogin(token) {
    console.log(token)
    firebase.auth().signInWithCustomToken(token).catch(function (error) {
        console.log(error)
    });
}


// ログアウト
function handleLogout() {
    firebase.auth().signOut()
}


// ログイン状態の変化で表示を切り替える
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