import {service} from "./BackendExtensionService.js";
import {editAccount} from "./FirebaseHandler.js";

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
    const table = document.getElementById("usrContainer");
    const usrContainer = document.querySelector("tbody");
    const fragment = document.createDocumentFragment();

    table.appendChild(usrContainer);

    for (const u of usersSlop) {
        let acc = await service.getAccount(u);
        console.log(acc);
        const usr = document.createElement("tr");
        const usrnm = document.createElement("td");
        usrnm.type = "text";
        usrnm.textContent = acc.username;
        usr.appendChild(usrnm);

        const role = document.createElement("td");
        role.type = "text";
        role.textContent = acc.role;
        usr.appendChild(role);

        const manage = document.createElement("td");
        const manageBtn = document.createElement("button");
        manageBtn.type = "button";
        manageBtn.textContent = "Manage Account";
        manageBtn.onclick = function () {
            window.location.href = `EditUser.html?id=${encodeURIComponent(acc.username)}`;
        }
        manage.appendChild(manageBtn);
        usr.appendChild(manage);
        fragment.appendChild(usr);
    }
    usrContainer.appendChild(fragment);
}

export async function getUserData() {
    const params = new URLSearchParams(window.location.search);
    const accId = params.get('id');
    let acc = await service.getAccount(accId);
    document.getElementById("usernameInput").value = acc.username;
    document.getElementById("roleInput").value = acc.role;
}

export async function editAccountData() {
    const params = new URLSearchParams(window.location.search);
    const accId = params.get('id');
    let acc = await service.getAccount(accId);
    let accName = document.getElementById("usernameInput").value;
    let accRole = document.getElementById("roleInput").value;
    let psswrd = document.getElementById("passwordInput").value;
    let psswrdConfirm = document.getElementById("passwordConfirmInput").value;

    if(accName !== acc.name) {
        let newName = {
            username: accName
        }
        console.log(newName);
        service.editAccount(acc, newName);
    }
    if(accRole !== acc.role) {
        let newRole = {
            role: accRole
        }
        console.log(newRole)
        service.editAccount(acc, newRole);
    }
    if(psswrd && psswrdConfirm) {
        console.log("data found in password and confirmation fields, checking for match.");
        if(psswrd.trim() === psswrdConfirm.trim()) {
            console.log("password fields match.")
            let newPassword = {
                password: psswrd
            }
            service.editAccount(acc, newPassword)
        }
        else {
            console.log("password fields do not match.")
        }
    }
    else if(psswrd || psswrdConfirm) {
        console.log("only one password field has data.")
    }
    else if(!psswrd && !psswrdConfirm) {
        console.log("password fields empty, will not update password.")
    }
    let confirmed = confirm("Save changes to user?");
    if(confirmed) {
        alert("Account updated successfully.");
        window.location.href = `ManageUser.html`;
    }
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
window.getUserData = getUserData;
window.editAccountData = editAccountData;
window.deleteAccount = deleteAccount;
window.passwordHidden = passwordHidden;