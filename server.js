const express = require("express");
const bodyParser = require("body-parser");
const socketIO = require('socket.io');
const http = require('http');

const formatMessage = require('./utils/message.js');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers

} = require('./utils/Users.js');
const url = require('url');

const app = express();
let server=  http.createServer(app);
let io = socketIO(server);











app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static('utils'))


app.use(bodyParser.urlencoded({extended: true}));
const AdminName = 'Admin'



app.get('/' , function (req , res) {



res.render('room');
});




app.post('/' , function(req , res) {
  var RoomName = req.body.room;
  var UserName = req.body.username;









res.redirect(url.format({
      pathname:"/room",
       query: {
          "User": req.body.username,
          "room":req.body.room
        }
     }));



})

app.get("/room" , function (req , res) {





  res.render('chat' , {RoomName:req.params.room});


});

io.on('connection' , function (socket) {

  socket.emit('message' , formatMessage(AdminName ,'Welcome to ChatApp'));

 socket.on('JoinRoom' , function({UserName , room}) {

   const user = userJoin(socket.id , UserName , room);

   socket.join(user.room);

   socket.broadcast.to(user.room).emit('message' , formatMessage(AdminName ,`${user.UserName} Joined the chat`));


   io.to(user.room).emit('roomUsers' , {
     room:user.room,
     users:getRoomUsers(user.room)


   });

 })



 socket.on('chatMessage' , function (msg) {
   const user = getCurrentUser(socket.id);


   io.emit('message' , formatMessage(user.UserName , msg));

 });






  socket.on('disconnect' , function() {
    const user = userLeave(socket.id);

    if(user)
    {
        io.to(user.room).emit('message' , formatMessage(AdminName , ` ${user.UserName} has left the chat`));
    };

    io.to(user.room).emit('roomUsers' , {
      room:user.room,
      users:getRoomUsers(user.room)


    });



  });



});









server.listen(3000 , function (req , res) {

  console.log("Server is running");

})
