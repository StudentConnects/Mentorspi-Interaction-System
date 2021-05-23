// Active/Inactive users list
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

// fetching all users data list  
document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch('/users/superAdmin/activeuserlist', {
      method: "GET",
      // body: 
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
  `<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="userdisable(${value.id})">` +
  '<i class="fas fa-trash-alt">' +
  "</button>";
  userDetails.classList = cssClass;
  user.appendChild(userDetails);
  userDetails = document.createElement("td");

  document.getElementById("active_user_list").appendChild(user);
});
}


// fetching all users data list  
document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch('/users/superAdmin/inactiveuserlist', {
      method: "GET",
      // body: 
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
var user = "";
// var buttons =
//     '<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="editcompany(value.id)">' +
//     '<i class="fas fa-edit"></i>' +
//     "</button>" +
//     '<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">' +
//     '<i class="fas fa-trash-alt">' +
//     "</button>";
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
    `<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="enableuser(${value.id})">` +
    '<i class="fas fa-trash-alt">' +
    "</button>";
  userDetails.classList = cssClass;
  user.appendChild(userDetails);
  userDetails = document.createElement("td");

  document.getElementById("inactive_user_list").appendChild(user);
});
}

function userdisable(x) {
  // alert('In edit func.'+'\nid ='+x)
  if (ConfirmDelete()) {
    // let i = x.parentNode.parentNode.rowIndex;
    // let companyid = compList[i - 1].id;
    let companydata = { id: x };

    fetch("/users/superAdmin/disableuser", {
      method: "DELETE",
      body: JSON.stringify(companydata),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) =>
        response.text().then((text) => {
          console.log(text);
          if (response.ok) {
            if (!alert("Successfully Deleted")) {
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
  var x = confirm("Are you sure you want to delete?");
  if (x) return true;
  else return false;
}

function ConfirmEnable() {
  var x = confirm("Are you sure you want to enable?");
  if (x) return true;
  else return false;
}

function enableuser(x) {
  // alert('In edit func.'+'\nid ='+x)
  if (ConfirmEnable()) {
    // let i = x.parentNode.parentNode.rowIndex;
    // let companyid = compList[i - 1].id;
    let companydata = { id: x };

    fetch("/users/superAdmin/enableuser", {
      method: "PATCH",
      body: JSON.stringify(companydata),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) =>
        response.text().then((text) => {
          console.log(text);
          if (response.ok) {
            if (!alert("Successfully Enabled")) {
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
  fetch("/users/superAdmin/specificuser", {
    method: "POST",
    body: JSON.stringify(companydata),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) =>
      response.json().then((text) => {
        // console.log(text);
        if (response.ok) {
          // console.log(text)
          let id = document.getElementById('userid')
          id.value =text.id
          let name = document.getElementById('name')
                name.value = text.user_name
                let pass =document.getElementById('password')
                pass.value = text.password
                let mobile = document.getElementById('mobile')
                mobile.value = text.phone_number
                let city = document.getElementById('city')
                city.value = text.city
                let email = document.getElementById('email')
                email.value = text.email
                let utype = document.getElementById('state')
                utype.value = text.state
                let add = document.getElementById('address')
                add.value = text.address
                let postal = document.getElementById('pincode')
                postal.value = text.pincode
                let country = document.getElementById('country')
                country.value = text.country
                let org = document.getElementById('org')
                org.value = text.organization
                let usertyper = document.getElementById('user_type')
                usertyper.value = text.user_type
                
        }
        return text;
      })
    )
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
  toggleModal('edit-company',x);
}