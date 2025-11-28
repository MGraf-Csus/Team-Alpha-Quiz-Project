import {service} from "./BackendExtensionService.js";

export async function signIn() {
    // Gather input field data for the username and password
    let usrnm = document.getElementById("username").value;
    let psswrd = document.getElementById("password").value;

    // get account from the username entered (id)
    let accdata = await service.getAccount(usrnm);

    // define role as the role of the returned account
    let role = accdata.role;
    if (role === "admin") {
        // when role is admin, call backend sign in with the provided username and password and take user to control panel
        let signedIn = await service.signIn(usrnm, psswrd);
        if(signedIn) {
            window.location.href = "AdminControlPanel.html";
        }
    }

}

export async function createAccount() {
    // On create account page gather all data from text fields
    let usrnm = document.getElementById("usernameInput").value;
    let psswrd = document.getElementById("passwordInput").value;
    let psswrdConfirm = document.getElementById("passwordConfirmInput").value;
    let role = document.getElementById("roleInput").value;

    // ensure that all data fields are filled
    if (!usrnm || !psswrd || !psswrdConfirm || !role ) {
        alert("Please fill out all fields.");
    }
    // continue if data is in each field
    else {
        // ensure the password fields match
        if( psswrd.trim() === psswrdConfirm.trim()) {
            // try to create account with given info
            let created = await service.createAccount(usrnm.trim(), psswrd.trim(), role.trim());
            if (created) {
                alert("Account created successfully.");
                window.location.href = `ManageUser.html`;
            }
            // fails to create account if return is false (account exists)
            else {
                alert("Account with username \""+usrnm+"\" already exists.");
            }
        }
        // let user know that passwords do not match
        else {
            alert("Please ensure account password is same for both fields.");
        }
    }
}

export async function getAccounts() {
    // create a list of all users
    let usersSlop = await service.getAllUserIDS();

    // define a table object from the table that exists within the html
    const table = document.getElementById("usrContainer");
    // define object to hold all following data
    const usrContainer = document.querySelector("tbody");
    const fragment = document.createDocumentFragment();

    table.appendChild(usrContainer);

    // for each user of the user list object
    for (const u of usersSlop) {
        // define account for current index
        let acc = await service.getAccount(u);
        console.log(acc);
        // define usr as a table row to hold each piece of data below
        const usr = document.createElement("tr");

        // define username and assign data to it as table data
        const usrnm = document.createElement("td");
        usrnm.type = "text";
        usrnm.textContent = acc.username;
        usr.appendChild(usrnm);

        // define role and assign data to it as table data
        const role = document.createElement("td");
        role.type = "text";
        role.textContent = acc.role;
        usr.appendChild(role);
        // define a button to manage the user as a piece of table data
        const manage = document.createElement("td");
        const manageBtn = document.createElement("button");
        manageBtn.type = "button";
        manageBtn.textContent = "Manage Account";
        // button function call to go to edit user page with a special url to the specific user
        manageBtn.onclick = function () {
            window.location.href = `EditUser.html?id=${encodeURIComponent(acc.username)}`;
        }

        // append objects to each other and to the fragment object
        manage.appendChild(manageBtn);
        usr.appendChild(manage);
        fragment.appendChild(usr);
    }
    // once all users are done being constructed in html, take fragment and add to the usr container (table body)
    usrContainer.appendChild(fragment);
}

export async function getUserData() {
    // get the user id from the url and get account with the id
    const params = new URLSearchParams(window.location.search);
    const accId = params.get('id');
    let acc = await service.getAccount(accId);
    // once edit user page loads, the text fields for the username and role will be filled automatically
    document.getElementById("username").textContent = "User Name: "+acc.username;
    document.getElementById("roleInput").value = acc.role;
}

export async function editAccountData() {
    // get user id from url, define account
    const params = new URLSearchParams(window.location.search);
    const accId = params.get('id');
    let acc = await service.getAccount(accId);
    // define name, role, password, and second password field data as objects
    let accRole = document.getElementById("roleInput").value;
    let psswrd = document.getElementById("passwordInput").value;
    let psswrdConfirm = document.getElementById("passwordConfirmInput").value;

    // check if accounts role in field has changed
    if(accRole !== acc.role) {
        // define an object for the new role and send it to the finalize account function
        let newRole = {
            role: accRole
        }
        console.log(newRole)
        await finalizeAccount(accId, newRole);
    }
    // if both fields for passwords are filled, continue
    if(psswrd && psswrdConfirm) {
        console.log("data found in password and confirmation fields, checking for match.");
        // check they are the sae
        if(psswrd.trim() === psswrdConfirm.trim()) {
            console.log("password fields match.")
            // send the new password to the database
            let newPassword = {
                password: psswrd
            }
            await finalizeAccount(accId, newPassword);
        }
        // passwords do not match
        else {
            alert("Password fields do not match.")
            console.log("password fields do not match.")
        }
    }
    // only one password field is filled
    else if(psswrd || psswrdConfirm) {
        alert("Both password fields must be filled out.")
    }
    // no password fields have data
    else if(!psswrd && !psswrdConfirm) {
        console.log("password fields empty, will not update password.")
    }
    if(!psswrd && !psswrdConfirm && (acc.role === accRole)) {
        alert("No changes made.")
    }
}
// this function serves to remove repeated code in the editAccountData function
export async function finalizeAccount(accId, newData) {
    // prompt user with confirmation
    let confirmed = confirm("Save changes to user?");
    if(confirmed) {
        // send the new data to the edit account function for database updating
        await service.editAccount(accId, newData);
        alert("Account updated successfully.");
        window.location.href = `ManageUser.html`;
    }
}

export async function deleteAccount() {
    // confirmation popup to user
    let confirmed = confirm("Are you sure you want to delete this account?");
    if(confirmed) {
        // secondary confirmation
        let confirmed2 = confirm("Are you absolutely sure you want to delete this account?");
        if(confirmed2) {
            // get the user id from url
            const params = new URLSearchParams(window.location.search);
            const accId = params.get('id');
            // delete account and change page
            await service.deleteAccount(accId)
            alert("Account deleted successfully.");
            window.location.href = `ManageUser.html`;
        }
    }
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