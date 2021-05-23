document.addEventListener(
    "DOMContentLoaded",
    function () {
      fetch('/users/subAdmin/userdata', {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
                let name = document.getElementById('name')
                name.value = text[0].user_name
                let mobile = document.getElementById('mobile')
                mobile.value = text[0].phone_number
                let city = document.getElementById('city')
                city.value = text[0].city
                let email = document.getElementById('email')
                email.value = text[0].email
                // let utype = document.getElementById('state')
                // utype.value = text[0].state
                let add = document.getElementById('address')
                add.value = text[0].address
                let postal = document.getElementById('pincode')
                postal.value = text[0].pincode
                let country = document.getElementById('country')
                country.value = text[0].country
                let org = document.getElementById('org')
                org.value = text[0].organization
                orgID = text[0].organization;
                let name1 = document.getElementById('profile_name')
                name1.innerHTML = text[0].user_name
            }
            return response.status;
          })
        )
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    },
    false
  );

// fetching all users data list  
document.addEventListener(
    "DOMContentLoaded",
    function () {
      fetch('/users/subAdmin/userlist', {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
                append_json(text)
            }
            return response.status;
          })
        )
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    },
    false
  );

  // creating dynamic rows for each record
function append_json(data) {
  userList = data;
  var user = "";
  var buttons =
      '<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="editcompany(value.id)">' +
      '<i class="fas fa-edit"></i>' +
      "</button>" +
      '<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">' +
      '<i class="fas fa-trash-alt">' +
      "</button>";
    let cssClass = 'user1Details.classList = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left";';
    data.forEach((value, key) => {
    let user = document.createElement("tr")
    let userDetails = document.createElement("td")
    userDetails.innerText = (key + 1);
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td")
    userDetails.innerText =  value.user_name;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.email;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.user_type;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.phone_number;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.address;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.city;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.pincode;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.state;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    userDetails.innerText =  value.country;
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");
    // userDetails.innerHTML =  buttons;
    userDetails.innerHTML = `<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="edituser(${value.id})">` +
      '<i class="fas fa-edit"></i>' +
      "</button>" +
      '<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">' +
      '<i class="fas fa-trash-alt">' +
      "</button>";
    userDetails.classList = cssClass;
    user.appendChild(userDetails);
    userDetails = document.createElement("td");

    document.getElementById("user_list").appendChild(user);
  });
}

function edituser(user_id){
  fetch('/users/subAdmin/userdata', {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            id: user_id,
        })
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
              let editname = document.getElementById('edit_name')
              editname.value = text[0].user_name
              let editemail = document.getElementById('edit_email')
              editemail.value = text[0].email
              let editpassword = document.getElementById('edit_password')
              editpassword.value = text[0].password
              let editmobile = document.getElementById('edit_mobile')
              editmobile.value = text[0].phone_number
              let editorg = document.getElementById('edit_institute')
              editorg.value = text[0].organization
              let editadd = document.getElementById('edit_address')
              editadd.value = text[0].address
              let editcity = document.getElementById('edit_city')
              editcity.value = text[0].city
              let editpostal = document.getElementById('edit_postal')
              editpostal.value = text[0].pincode
              let editstate = document.getElementById('edit_state')
              editstate.value = text[0].state
              let editcountry = document.getElementById('edit_country')
              editcountry.value = text[0].country
              let userId = document.getElementById('userId')
              userId.value = user_id;

            }
            return response.status;
          })
        )
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
        
  toggleModal('edit-company');
  
}

document.getElementById("update_user").addEventListener("click", update_user);

function update_user() {
  let userId = document.getElementById('userId').value;

  let name = document.getElementById('edit_name').value
  let email = document.getElementById('edit_email').value
  let password = document.getElementById('edit_password').value
  let mobile = document.getElementById('edit_mobile').value
  let org = document.getElementById('edit_institute').value
  let add = document.getElementById('edit_address').value
  let city = document.getElementById('edit_city').value
  let postal = document.getElementById('edit_postal').value
  let state = document.getElementById('edit_state').value
  let country = document.getElementById('edit_country').value
  let isActive = document.querySelector("#isActive").checked ? "true" : "false";

  let userData = {
    name : name,
    email :email,
    password :password,
    mobile : mobile,
    org : org,
    add : add,
    city : city,
    postal : postal,
    state : state,
    country : country,
    isActive :isActive,
    user_id: userId
  }

  fetch('/users/subAdmin/updateusers', {
        method: "POST",
        body: JSON.stringify( userData ),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        if (!alert("Successfully updated user data!")) {
          window.location.reload();
        }
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });

}

// // fetching organization data
// document.addEventListener(
//     "DOMContentLoaded",
//     function () {
//       fetch('/users/subAdmin/orgdata', {
//         method: "GET",
//         headers: { "Content-type": "application/json; charset=UTF-8" },
//       })
//         .then((response) =>
//           response.json().then((text) => {
//             if (response.ok) {
//                 let orgname = document.getElementById('org_name')
//                 orgname.value = text[0].name
//                 let contactperson = document.getElementById('org_contactPerson')
//                 orgname.value = text[0].orgAdmin
//                 let orgmobile = document.getElementById('org_mobile')
//                 orgmobile.value = text[0].contactPhone
//                 let email = document.getElementById('org_email')
//                 email.value = text[0].contactEmail
//                 let orgaddress = document.getElementById('org_address')
//                 orgaddress.value = text[0].address

                
//             }
//             return response.status;
//           })
//         )
//         .then((json) => console.log(json))
//         .catch((err) => console.log(err));
//     },
//     false
// );