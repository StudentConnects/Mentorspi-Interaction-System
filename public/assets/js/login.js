// document.getElementById("btn_login").addEventListener("click", login);

document.getElementById("form_login").addEventListener("submit",login);

// document.getElementById("btn_recover").addEventListener("click", recover);



function forgotpassword() {
    var xlogin = document.getElementById("login");
    var yreset = document.getElementById("reset");
    xlogin.classList.toggle("hidden");
    yreset.classList.toggle("hidden");
}


function login(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    console.log([email,password])
    if (!(isFormEmpty(email, password))) {
        if (validateEmail(email)) {
            if (validatePassword(password)) {
                submit_login(email, password);
                return true
            }else{
                return false
            }
        }
    }
}


function recover() {

    let recoveryemail = document.getElementById("recoveryemail").value;

        if (validateEmail(recoveryemail)) {
                submit_recover(recoveryemail);
        }
}


function isFormEmpty(email, password) {

    if (email.length == 0 || password.length == 0) {
        alert("Fields can't be left empty");
        return true;
    } else {
        if (email.length > 60 || password.length > 1024) {
            alert("Field Value Too Long");
            return true;
        } else {
            return false;
        }

    }

}


function validateEmail(email) {
    var remail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

    if (!email.match(remail)) {
        alert("Invalid email address");
        return false;
    }

    return true;

}

function validatePassword(password) {
    var rpassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    if (!password.match(rpassword)) {
        alert("Invalid Password!! Password should contain atleast one number and one special character and should be of minimum 8 characters");
        return false;
    }

    return true;

}


function submit_login( email, password) {

    let _data = {
        email : email,
        password : password
    }

    fetch('/login', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.text())
        .then(text=>alert(text))
        // .then(response => response.json())
        // .then(json => console.log(json))
        .catch(err => console.log(err));
}

function submit_recover( email) {

    let _data = {
        email : email,
    }

    fetch('/login', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
}