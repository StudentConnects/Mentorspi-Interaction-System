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
        // body: 
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
    userDetails.innerHTML = `<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="editcompany(${value.id})">` +
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

function editcompany(user_id){

  toggleModal('edit-company');
}