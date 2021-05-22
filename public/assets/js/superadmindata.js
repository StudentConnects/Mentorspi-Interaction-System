console.log('studentuser.js file Loaded sucessfully.')
document.addEventListener(
    "DOMContentLoaded",
    function () {
        // var datastring;
        // if(usertype=='superAdmin'){
        //     datastring = '/users/super-admin/userdata'
        // }else if(usertype=='subAdmin'){
        //     datastring = '/users/admin/userdata'
        // }else if(usertype=='mentor'){
        //     datastring = '/users/mentor/userdata'
        // }else if(usertype=='superadmin'){
        //     datastring = '/users/student/userdata'
        // }else{
        //     alert('Invalid User Type')
        // }
      fetch('/users/superAdmin/userdata', {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
                console.log(text[0])
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
                // console.log(text[0].name);
            
            }
            return response.status;
          })
        )
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    },
    false
  );