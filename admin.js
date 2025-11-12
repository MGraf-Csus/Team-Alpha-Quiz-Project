const button = document.getElementById("sign-in-button");

function signIn() {
    let usrnm = document.getElementById("username").value;
    let psswrd = document.getElementById("password").value;
    if (usrnm === "admin" && psswrd === "password") {
        window.location.href = "AdminControlPanel.html";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const password = document.getElementById("password");

    password.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Trigger the button element with a click
        document.getElementById("sign-in-button").click();
    }
    })
})