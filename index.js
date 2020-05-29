const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const   {addUser, removeUser, getUser, getUserInRoom, nextUser, adminExist, nextUserByRoom, updateUser } = require('./users.js');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.sockets.in('1234').clients(function(err, clients) {
    clients.forEach(client => {
        let user = io.sockets.connected[client];
        //console.log("Connected Client ", user.displayName);
    });
});
io.on('connection', (socket) => {

//     io.of('/').in(1234).clients((error, clients) => {
//     if (error) throw error;
//     console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
//   });
    //console.log(socket.id);
    socket.on('join', ({name, room}, callback)=>{
        if(getUserInRoom(room).length === 0){
            var type = 'admin'; 
        }else{
            var type = 'player';
        }

    const {error, user} = addUser({id:socket.id, name, room, type:type});
       if(error){
           return callback(error);
       }
       socket.emit('message', {user:'admin', text:`${user.name} ${user.type}, welcome to the room ${user.room}`});
        if(type === 'admin'){
           socket.to(socket.id).emit('isAdmin', true);
       }
       
      // socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name}, has joined`});
       
        // console.log(io.sockets.adapter.rooms['Room Name'].sockets)
       
       
       socket.join(user.room);
      if(getUser(socket.id).type === 'admin'){
        socket.to(socket.id).emit('isAdmin', true);
      }
       io.to(user.room).emit('roomData', {room:user.room, users: getUserInRoom(user.room), id: socket.id});
       callback(); 
    });

    socket.on('sendMessage', ({message, idMarker})=>{
        const user = getUser(socket.id);
        if(idMarker === ''){
            var usersId = user.id;
        }else{
            var usersId = idMarker;
        }
        
        const nextUserId = nextUser(socket.id);
        io.to(nextUserId).emit('message', {user: usersId, text: message});
        // if(nextUserId === newId){
        //    // io.to(user.room).emit('endGame', true);
        // }else{
            
        // }
        
        
       
    })

    socket.on('sendDrawing', ({drawing, idMarker})=>{
        const user = getUser(socket.id);
        const nextUserId = nextUser(socket.id);
        io.to(nextUserId).emit('receiveDrawing', {drawing:drawing, id:idMarker});
        if(nextUserId === idMarker){
           // io.to(user.room).emit('endGame', true);
        }else{
            
        }
        
    })

    socket.on('startGame', (gameInfo)=>{
        
        const user = getUser(socket.id);
        io.to(user.room).emit('gameStart', {start:gameInfo});

    })
    socket.on('checkRoom', ({room, id})=>{
       
        let userse = getUserInRoom(room);
         //console.log(userse.length);
        if(userse.length === 0){
            
            io.to(id).emit('checkRoomResponse', {response:false});
        }else{
            io.to(id).emit('checkRoomResponse', {response:true});
        }
    })
    socket.on('disconnect', ()=>{
        //console.log(socket.id, "user has left");
        // const userID = getUser(socket.id);
        // if(adminExist(socket.id)){
        //     console.log('no new admin'); 
        //  }else{
        //      console.log('new admin');
        //      io.to(nextUser(socket.id)).emit('isAdmin', true);
        //  }
        //console.log(userID);
        const user = removeUser(socket.id);
        if(user){
           // io.to(user.room).emit('message', {user:'admin', text: `${user.name} has left`});
            
            if(adminExist(user.room)){
                //console.log('non admin');
            }else{
                if(getUserInRoom(user.room).length === 0){

                }else{
                     // console.log(getUserInRoom(user.room)[0].id, 'users');
                io.to(getUserInRoom(user.room)[0].id).emit('isAdmin', true);
                
                updateUser(getUserInRoom(user.room)[0].id);
                io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
                }
              
            }
            io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
            
           
        }
    })
});


app.use(router);
server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));