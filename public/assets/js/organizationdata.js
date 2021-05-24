console.log('in comny.js')
// Active/Inactive companies list
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

// toggleModal function
function toggleModal(modalID,value){
    document.getElementById(modalID).classList.toggle("hidden");
    document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
    document.getElementById(modalID).classList.toggle("flex");
    document.getElementById(modalID + "-backdrop").classList.toggle("flex"); 
  }

document.getElementById("submit_addCompany").addEventListener("click", submit_addCompany);
document.getElementById("submit_editCompany").addEventListener("click", submit_editCompany);
// Adding new company function
function submit_addCompany() {
  let company_name = document.getElementById("company_name").value;
  let contact_person = document.getElementById("contact_person").value;
  let company_email = document.getElementById("company_email").value;
  let company_phone = document.getElementById("company_phone").value;
  let company_address = document.getElementById("company_address").value;

  const fileInput = document.querySelector("#company_logo");
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  const options = {
    method: "POST",
    body: formData,
  };
  let isActive = document.querySelector("#isActive").checked ? 1 : 0;

  fetch("/uploadImage", options)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      // do stuff with `data`, call second `fetch`
      console.log(JSON.stringify(data));

      let company_Infoadd = {
        company_name: company_name,
        contact_person: contact_person,
        company_email: company_email,
        company_phone: company_phone,
        company_address: company_address,
        company_logo: data,
        isActive: isActive,
      };
      console.log("COMPANY DATA ----- ", company_Infoadd);

      return fetch("/users/superAdmin/addCompany", {
        method: "POST",
        body: JSON.stringify(company_Infoadd),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    })
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      // do stuff with `data`
      if (!alert("Successfully Added :" + data)) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.log("Requestfailed", error);
    });
}
function submit_editCompany(id){
  let id1 = document.getElementById("orgid").value;
  let company_name1 = document.getElementById("company_name1").value;
  let contact_person1 = document.getElementById("contact_person1").value;
  let company_email1 = document.getElementById("company_email1").value;
  let company_phone1 = document.getElementById("company_phone1").value;
  let company_address1= document.getElementById("company_address1").value;
  // alert([id1,company_name1,company_phone1,company_address1,company_email1,contact_person1])
  
      // console.log(JSON.stringify(data));

      let company_Infoadd = {
        id : id1,
        company_name: company_name1,
        contact_person: contact_person1,
        company_email: company_email1,
        company_phone: company_phone1,
        company_address: company_address1,
      };
      console.log("COMPANY DATA ----- ", company_Infoadd);

   fetch("/users/superAdmin/editOrgdata", {
        method: "POST",
        body: JSON.stringify(company_Infoadd),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then(function (response) {
      return response.text();
    })
    .then(function (data) {
      // do stuff with `data`
      if (!alert("Successfully Added :" + data)) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.log("Requestfailed", error);
    });

}
// document.getElementById("edit_company").addEventListener("click", showmodal);

function showModal() {
  toggleModal('add-company');
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch("/users/superAdmin/listActiveCompanies", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) =>
        response.json().then((text) => {
          if (response.ok) {
            console.log(text);
            append_json_active(text);
          }
          return response.status;
        })
      )
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
  },
  false
);

// this function appends the json data to the table 'company_list'
function append_json_active(data) {
  compList = data;

  var company = "";
  // ITERATING THROUGH OBJECTS
  data.forEach((value,key) => {
    console.log(key,value)
  // $.each(data, function (key, value) {
    // Making Buttons
    var button1 =
    `<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="editcompany(${value.id})">` +
  '<i class="fas fa-edit"></i>' +
  "</button>"
    var button2 =
    `<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="disablecompany(${value.id})">` +
  '<i class="fas fa-minus">' +
  "</button>";
    
    // CONSTRUCTION OF ROWS HAVING
    // DATA FROM JSON OBJECT
    company += "<tr>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + (key + 1) + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.name + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.address + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.contactemail + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.contactphone + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.subscriptionleft + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.photourl + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.isverified + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.isactive + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + button1 + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + button2 + "</td>";
    company += "</tr>";
  });

  // INSERTING ROWS INTO TABLE
  // $("#activeCompany_list").append(company);
  document.getElementById('activeCompany_list').innerHTML = company
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch("/users/superAdmin/listInactiveCompanies", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) =>
        response.json().then((text) => {
          if (response.ok) {
            console.log(text);
            append_json_inactive(text);
          }
          return response.status;
        })
      )
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
  },
  false
);
// this function appends the json data to the table 'company_list'
function append_json_inactive(data) {
  compList = data;

  var company = "";
  // ITERATING THROUGH OBJECTS
  data.forEach((value,key) => {
    console.log(key,value)
    // $.each(data, function (key, value) {
    // Making Buttons
    var button1 =
    `<button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="editcompany(${value.id})">` +
  '<i class="fas fa-edit"></i>' +
  "</button>"
    var button2 =
    `<button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onclick="enablecompany(${value.id})">` +
  '<i class="fas fa-plus">' +
  "</button>";
    // CONSTRUCTION OF ROWS HAVING
    // DATA FROM JSON OBJECT
    company += "<tr>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + (key + 1) + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.name + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.address + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.contactemail + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.contactphone + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.subscriptionleft + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.photourl + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.isverified + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + value.isactive + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + button1 + "</td>";
    company += `<td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">` + button2 + "</td>";
    company += "</tr>";
  });

  // INSERTING ROWS INTO TABLE
  // $("#inactiveCompany_list").append(company);
  document.getElementById('inactiveCompany_list').innerHTML = company
}

function editcompany(x) {
  let companydata = { id: x };
  fetch("/users/superAdmin/getOrgdata", {
    method: "POST",
    body: JSON.stringify(companydata),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) =>
      response.json().then((text) => {
        console.log(text);
        if (response.ok) {
          console.log(text)
          let id = document.getElementById('orgid')
                id.value = text.id
              let name = document.getElementById('company_name1')
                name.value = text.name
              let adminid = document.getElementById('contact_person1')
              adminid.value = text.orgadmin
              let email = document.getElementById('company_email1')
              email.value = text.contactemail
              let mobile = document.getElementById('company_phone1')
              mobile.value = text.contactphone
              let address = document.getElementById('company_address1')
              address.value = text.address
        }
        return text;
      })
    )
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
  toggleModal('edit-company',x);
}

function disablecompany(x) {
  // alert('In edit func.'+'\nid ='+x)
  if (ConfirmDelete()) {
    // let i = x.parentNode.parentNode.rowIndex;
    // let companyid = compList[i - 1].id;
    let companydata = { id: x };

    fetch("/users/superAdmin/disableCompany", {
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

function enablecompany(x) {
  // alert('In edit func.'+'\nid ='+x)
  if (ConfirmEnable()) {
    // let i = x.parentNode.parentNode.rowIndex;
    // let companyid = compList[i - 1].id;
    let companydata = { id: x };

    fetch("/users/superAdmin/enableCompany", {
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