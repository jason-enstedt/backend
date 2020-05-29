const users = [];

const addUser = ({id, name, room, type}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(existingUser){
        return {error: 'username is taken'};
    }
    const user = {id, name, room, type};

    users.push(user);

    return {user};
}
// const roomList = (room) => {

// }
const nextUser = (id) =>{
    
    let usersRoom = users.find((user)=> user.id === id);
   // console.log(typeof usersRoom)
    let newNewUser = usersRoom.room;
   //console.log(typeof newNewUser)
    let newUsers = users.filter((user) => user.room === newNewUser);
    //console.log(typeof newUsers);
    let index = newUsers.findIndex((user) => user.id === id);

    if(newUsers.length - 1 === index){
        return newUsers[0].id;
    }else{
        return newUsers[index + 1].id;
    }
    
}

const nextUserByRoom = (room) =>{
    
    let newUsers = users.filter((user) => user.room === room);
    //console.log(typeof newUsers);
    return newUsers[0];
    
}

const removeUser = (id) => {

    index = users.findIndex((user)=> user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}
const adminExist = (room) => {
    
   let newroom = users.filter((user) => user.room === room);
    if(newroom.some(e => e.type === "admin")){
        return true;
    }else{
        return false;
    }
}
const getUser = (id) => users.find((user)=> user.id === id);

const updateUser = (id) => {
    let index = users.findIndex((user) => user.id === id);
    console.log(index);
    console.log('ehhh admin', users[index].type);
    
     users[index].type = 'admin';
    
    

}
const getUserInRoom = (room) => users.filter((user)=> user.room === room);

//const getIdInRoom = (room) => users.filter((user)=> user.room === room);
console.log(getUserInRoom('1234'));
module.exports = {addUser, removeUser, getUser, getUserInRoom, nextUser, adminExist, nextUserByRoom, updateUser};