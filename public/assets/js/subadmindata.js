// changing active and inactive tab
function changeAtiveTab(event, tabID) {
  let element = event.target;
  while (element.nodeName !== "A") {
    element = element.parentNode;
  }
  ulElement = element.parentNode.parentNode;
  aElements = ulElement.querySelectorAll("li > a");
  tabContents = document.getElementById("tabs-id").querySelectorAll(".tab-content > div");
  for (let i = 0; i < aElements.length; i++) {
    aElements[i].classList.remove("text-white");
    aElements[i].classList.remove("bg-pink-600");
    aElements[i].classList.add("text-pink-600");
    aElements[i].classList.add("bg-white");
    tabContents[i].classList.add("hidden");
    tabContents[i].classList.remove("block");
  }
  element.classList.remove("text-pink-600");
  element.classList.remove("bg-white");
  element.classList.add("text-white");
  element.classList.add("bg-pink-600");
  document.getElementById(tabID).classList.remove("hidden");
  document.getElementById(tabID).classList.add("block");
}

// toggleModal
function toggleModal(modalID){
  document.getElementById(modalID).classList.toggle("hidden");
  document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
  document.getElementById(modalID).classList.toggle("flex");
  document.getElementById(modalID + "-backdrop").classList.toggle("flex");
}  

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
                let utype = document.getElementById('state')
                utype.value = text[0].state
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

// ------------------------ NEW FUNCTIONS ------------------------

// fetching all users data list  
document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch('/users/subAdmin/activeuserlist', {
      method: "GET",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) =>
        response.json().then((text) => {
          if (response.ok) {
            console.log(text)
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
  userDetails.innerHTML = `<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="edituser(${value.id})">` +
  '<i class="fas fa-edit"></i>' +  "</button>";
  userDetails.classList = cssClass;
  user.appendChild(userDetails);
  userDetails = document.createElement("td");
  userDetails.innerHTML = `<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="userdisable(${value.id})">` +
  '<i class="fas fa-minus">' +  "</button>";
  userDetails.classList = cssClass;
  user.appendChild(userDetails);
  document.getElementById("active_user_list").appendChild(user);
});
}

// fetching all users data list  
document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch('/users/subAdmin/inactiveuserlist', {
      method: "GET",
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) =>
        response.json().then((text) => {
          if (response.ok) {
            console.log(text)
              append_json_new(text)
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
function append_json_new(data) {
  userList = data;
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
  userDetails.innerHTML = `<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="edituser(${value.id})">` +
  '<i class="fas fa-edit"></i>' +  "</button>";
  userDetails.classList = cssClass;
  user.appendChild(userDetails);
  userDetails = document.createElement("td");
  userDetails.innerHTML = `<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="enableuser(${value.id})">` +
  '<i class="fas fa-plus">' +  "</button>";
  userDetails.classList = cssClass;
  user.appendChild(userDetails);

  document.getElementById("inactive_user_list").appendChild(user);
});
}

function userdisable(x) {
  if (ConfirmDelete()) {
    let companydata = { id: x };

    fetch("/users/subAdmin/disableuser", {
      method: "DELETE",
      body: JSON.stringify(companydata),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) =>
        response.text().then((text) => {
          console.log(text);
          if (response.ok) {
            if (!alert("Successfully deactivated user.")) {
              window.location.reload();
            }
          }
          return text;
        })
      )
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
  }
}

function ConfirmDelete() {
  var x = confirm("Are you sure you want to deactivate?");
  if (x) return true;
  else return false;
}

function ConfirmEnable() {
  var x = confirm("Are you sure you want to enable?");
  if (x) return true;
  else return false;
}

function enableuser(x) {
  if (ConfirmEnable()) {
    let companydata = { id: x };

    fetch("/users/subAdmin/enableuser", {
      method: "PATCH",
      body: JSON.stringify(companydata),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) =>
        response.text().then((text) => {
          console.log(text);
          if (response.ok) {
            if (!alert("Successfully enabled user.")) {
              window.location.reload();
            }
          }
          return text;
        })
      )
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
  }
}

function edituser(x) {
  let companydata = { id: x };
  fetch("/users/subAdmin/specificuser", {
    method: "POST",
    body: JSON.stringify(companydata),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) =>
      response.json().then((text) => {
        if (response.ok) {
          let id = document.getElementById('userId')
          id.value = text.id
          let name = document.getElementById('edit_name')
          name.value = text.user_name
          let pass =document.getElementById('edit_password')
          pass.value = text.password
          let mobile = document.getElementById('edit_mobile')
          mobile.value = text.phone_number
          let city = document.getElementById('edit_city')
          city.value = text.city
          let email = document.getElementById('edit_email')
          email.value = text.email
          let utype = document.getElementById('edit_state')
          utype.value = text.state
          let add = document.getElementById('edit_address')
          add.value = text.address
          let postal = document.getElementById('edit_postal')
          postal.value = text.pincode
          let country = document.getElementById('edit_country')
          country.value = text.country
          let org = document.getElementById('edit_institute')
          org.value = text.organization
          let usertyper = document.getElementById('edit_usertype')
          usertyper.value = text.user_type
                
        }
        return text;
      })
    )
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
  toggleModal('edit-company',x);
}
