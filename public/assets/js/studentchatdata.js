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

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      fetch('/users/student/mentordata', {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) =>
          response.json().then((text) => {
            if (response.ok) {
               console.log(text) 
               let name1 = document.getElementById('mentor_list')
               var list ="";
               text.forEach(element => {
                 console.log(element)
                var divtag =`<div class="intro-x cursor-pointer box relative flex items-center p-5 ">
                <div class="w-12 h-12 flex-none image-fit mr-1">
                    <img class="rounded-full" src="../../assets/img/user.png">
                </div>
                <div class="ml-2 overflow-hidden">
                    <div class="flex items-center">
                        <a href="javascript:;" class="font-medium">${element.user_name}</a>
                        
                    </div>
                    <div class="w-full truncate text-gray-600">${element.organization}</div>
                </div>
            </div>`
                list +=divtag
               });
               name1.innerHTML = list
            }
            return response.status;
          })
        )
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    },
    false
  );