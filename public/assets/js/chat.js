console.log('inside chat.js')
const socket = io('http://localhost:8081')
console.log(socket)
socket.on('connect',(data)=>{
    socket.on('welcome',(message)=>{
        console.log(message)
        // document.getElementById('basic').innerHTML = message
    })
    socket.emit('message',{data: 'I am excited to get connected !!!!!'})
})
    