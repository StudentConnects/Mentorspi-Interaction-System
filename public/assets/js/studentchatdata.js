console.log('studentuser.js file Loaded sucessfully.')
document.addEventListener(
    "DOMContentLoaded",
    function () {
       
      fetch('/users/student/userdata', {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
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