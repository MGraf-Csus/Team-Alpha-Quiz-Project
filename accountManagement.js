import {service} from "./BackendExtensionService.js";

export async function signIn() {
    let usrnm = document.getElementById("username").value;
    let psswrd = document.getElementById("password").value;

    let accdata = await service.getAccount(usrnm);
    let role = accdata.role;
    if (role === "admin") {
        let signedIn = await service.signIn(usrnm, psswrd);
        if(signedIn) {
            window.location.href = "AdminControlPanel.html";
        }
    }

}

export async function createAccount() {
    let usrnm = document.getElementById("usernameInput").value;
    let psswrd = document.getElementById("passwordInput").value;
    let psswrdConfirm = document.getElementById("passwordConfirmInput").value;
    let role = document.getElementById("roleInput").value;

    if (!usrnm || !psswrd || !psswrdConfirm || !role ) {
        alert("Please fill out all fields.");
    }
    else {
        if( psswrd.trim() === psswrdConfirm.trim()) {
            let created = await service.createAccount(usrnm.trim(), psswrd.trim(), role.trim());
            if (created) {
                alert("Account created successfully.");
            }
            else {
                alert("Account with username \""+usrnm+"\" already exists.");
            }
        }
        else {
            alert("Please ensure account password is same for both fields.");
        }
    }
}

export async function getAccounts() {
    let usersSlop = await service.getAllUserIDS();
    const usrContainer = document.getElementById("usrContainer");

    const fragment = document.createDocumentFragment();

    usersSlop.forEach((u, i) => {
        const usr = document.createElement("tr");
        const usrnm = document.createElement("td");
        usrnm.type = "text";
        usrnm.text = u.name;
        usr.appendChild(usrnm);

        const role = document.createElement("td");
        role.type = "text";
        role.text = u.role;
        usr.appendChild(role);

        const manage = document.createElement("td");
        manage.type = "button";
        manage.text = "Manage Account";

        usr.appendChild(manage);
        fragment.appendChild(usr);
    });
    usrContainer.appendChild(fragment);

}

export async function deleteAccount() {

}

export function passwordHidden() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
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

window.signIn = signIn;
window.createAccount = createAccount;
window.getAccounts = getAccounts;
window.deleteAccount = deleteAccount;
window.passwordHidden = passwordHidden;