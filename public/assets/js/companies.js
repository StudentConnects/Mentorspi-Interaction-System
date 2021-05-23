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
function toggleModal(modalID){
    document.getElementById(modalID).classList.toggle("hidden");
    document.getElementById(modalID + "-backdrop").classList.toggle("hidden");
    document.getElementById(modalID).classList.toggle("flex");
    document.getElementById(modalID + "-backdrop").classList.toggle("flex");
  }  

document.getElementById("submit_addCompany").addEventListener("click", submit_addCompany);

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

document.getElementById("edit_company").addEventListener("click", showmodal);

function showModal() {
  toggleModal('add-company');
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch("/users/superadmin/listActiveCompanies", {
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
  $.each(data, function (key, value) {
    // Making Buttons
    var buttons =
      '<button class="btn btn-success btn-fab btn-fab-mini btn-round" onclick="editcompany(this)">' +
      '                          <i class="material-icons">edit</i>' +
      "                        </button>" +
      '                        <button class="btn btn-danger btn-fab btn-fab-mini btn-round" onclick="deletecompany(this)">' +
      '                          <i class="material-icons">delete</i>' +
      "                        </button>";
    // CONSTRUCTION OF ROWS HAVING
    // DATA FROM JSON OBJECT
    company += "<tr>";
    company += "<td>" + (key + 1) + "</td>";
    company += "<td>" + value.name + "</td>";
    company += "<td>" + value.description + "</td>";
    company += "<td>" + buttons + "</td>";
    company += "</tr>";
  });

  // INSERTING ROWS INTO TABLE
  $("#activeCompany_list").append(company);
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch("/users/superadmin/listInactiveCompanies", {
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

function append_json_inactive(data) {
  compList = data;

  var company = "";
  // ITERATING THROUGH OBJECTS
  $.each(data, function (key, value) {
    // Making Buttons
    var buttons =
      '<button class="btn btn-success btn-fab btn-fab-mini btn-round" onclick="editcompany(this)">' +
      '                          <i class="material-icons">edit</i>' +
      "                        </button>" +
      '                        <button class="btn btn-danger btn-fab btn-fab-mini btn-round" onclick="deletecompany(this)">' +
      '                          <i class="material-icons">delete</i>' +
      "                        </button>";
    // CONSTRUCTION OF ROWS HAVING
    // DATA FROM JSON OBJECT
    company += "<tr>";
    company += "<td>" + (key + 1) + "</td>";
    company += "<td>" + value.name + "</td>";
    company += "<td>" + value.description + "</td>";
    company += "<td>" + buttons + "</td>";
    company += "</tr>";
  });

  // INSERTING ROWS INTO TABLE
  $("#inactiveCompany_list").append(company);
}

function editcompany(x) {
  // company_edit = true;
  let i = x.parentNode.parentNode.rowIndex;
  // console.log(JSON.stringify(compList));
  document.getElementById("company_name").value = compList[i - 1].name;
  document.getElementById("company_description").value =
    compList[i - 1].description;
  showmodal();
}

function deletecompany(x) {
  if (ConfirmDelete()) {
    let i = x.parentNode.parentNode.rowIndex;
    let companyid = compList[i - 1].id;
    let companydata = { id: companyid };

    fetch("/users/superadmin/disableCompany", {
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