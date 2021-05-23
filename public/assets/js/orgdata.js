console.log("In orgdata.js file");
// fetching organization data
document.addEventListener(
    "DOMContentLoaded",
    function () {
      fetch('/users/subAdmin/orgdata', {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
                console.log(text[0]);
                let orgname = document.getElementById('org_name')
                orgname.value = text[0].name
                // let contactperson = document.getElementById('org_contactPerson')
                // orgname.value = text[0].orgAdmin
                let orgmobile = document.getElementById('org_mobile')
                orgmobile.value = text[0].contactphone
                let email = document.getElementById('org_email')
                email.value = text[0].contactemail
                let orgaddress = document.getElementById('org_address')
                orgaddress.value = text[0].address

                let orgId = document.getElementById('org_id')
                orgId.value = text[0].id
            }
            return response.status;
          })
        )
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    },
    false
);

document.getElementById("update_org").addEventListener("click", update_org);

function update_org() {
  let orgId = document.getElementById('org_id').value;

  let name = document.getElementById('org_name').value
  let email = document.getElementById('org_email').value
  let mobile = document.getElementById('org_mobile').value
  let address = document.getElementById('org_address').value

  let orgData = {
    name : name,
    email :email,
    mobile : mobile,
    address : address,
    orgId: orgId
  }

  fetch('/users/subAdmin/updateorgdata', {
        method: "POST",
        body: JSON.stringify( orgData ),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        if (!alert("Successfully updated organization data!")) {
        //   window.location.reload();
        }
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });

}