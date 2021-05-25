document.getElementById("btn_register").addEventListener("click", signup);

function signup(event) {

    event.preventDefault();

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let institute_id = document.getElementById("institute_id").value;
    let mobile = document.getElementById("mobile").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let country = document.getElementById("country").value;
    let postcode = document.getElementById("postal_code").value;
    let state = document.getElementById("state").value;


    if (!(isFormEmpty(fullname, email, mobile, password))) {
        if (checkName(fullname)) {
            if (validateEmail(email)) {
                if (checkNumber(mobile)) {
                    if (validatePassword(password)) {
                        submit_details(fullname, email, password, institute_id, mobile, address, city, country,state, postcode);
                    }
                }
            }

        }

    }
}

function isFormEmpty(fullname, email, mobile, password) {

    if (fullname.length == 0 || email.length == 0 || mobile.length == 0 || password.length == 0) {
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

function checkNumber(mobile) {
    var MN = /^\d{10}$/;
    if (MN.test(mobile)) {
        return true;
    } else {
        alert("Phone Number Is Not Valid.");
        return false;
    }
}

function checkName(fullname) {
    if (fullname.length > 40) {
        alert("Full Name too long, exceeding 40 characters");
        return false;
    } else {
        var regex = new RegExp("^[a-zA-Z ]+$");
        if ((!regex.test(fullname))) {
            alert("Full Name Can Contain Only Alphabets and Spaces");
            return false;
        } else {
            return true;
        }
    }
}



function submit_details(fullname, email, password, institute_id, mobile, address, city, country,state, postcode) {
    photo = 'https://google.com';
    let _data = {
        userName: fullname,
        email: email,
        password: password,
        institute_id: institute_id,
        mobile: mobile,
        address: address,
        city: city,
        state:state,
        country: country,
        postcode: postcode,
        photo: photo
    }

    fetch('/register', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        // .then(response => response.text())
        // .then(text => {
        //     // showmodal(text);
        //     alert(text);
        // })
        .then(response =>  {
            alert('User registration successful.');
            window.location = "/login.html";
        })
        .catch(err => console.log(err));
}

// var reader = new FileReader();
// reader.onload = function (e) {
//     $('#profile_avatar').attr('src', e.target.result);
// }

// function readURL(input) {
//     if (input.files && input.files[0]) {
//         reader.readAsDataURL(input.files[0]);
//     }
// }

// $("#profile_pic").change(function () {
//     readURL(this);
// });



// function showmodal(msg) {
//     document.getElementById("responseMsg").innerHTML = msg;
//   $("#modalresponse").modal("show");
// }

// $('#modalresponse').on('hidden.bs.modal', function () {
//     location.reload();
//   });