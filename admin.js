const button = document.getElementById("sign-in-button");

function signIn() {
    let usrnm = document.getElementById("username").value;
    let psswrd = document.getElementById("password").value;
    if (usrnm === "admin" && psswrd === "password") {
        window.location.href = "AdminControlPanel.html";
    }
}
