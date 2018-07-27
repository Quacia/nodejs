const router = require('express').Router();
module.exports = router;

//방 만들기, name= 채팅방 이름, users = 접속한 회원들
var rooms = [
  {name:'apple', users:[]},
  {name:'banana', users:[]}
];

router.get("/", function(request, response, next){
  response.render("msg/view");
});

io.sockets.on("connection", function(socket){
  socket.on("join", function(data){
    //방에 사람을 넣어주기
    switch(data.name){
      case 'apple' : socket.roomNum = 0; break;
      case 'banana' : socket.roomNum = 1; break;
    }
    //socket에는 기본적으로 중복되지 않는 id가 부여된다.
    //방에 유저를 담을 때, socketid와 userid를 받아서 넣는다.
    rooms[socket.roomNum].users.push({id:socket.id, userid:data.userid});

    //1. 접속해있던 유저들에게 새로 입장한 사람을 알려주기.
    io.sockets.in(data.name).emit("userupdate", {id:socket.id, userid:data.userid});
    socket.join(data.name);
    //2. 접속한 유저에게 방에 존재하던 사람들의 목록을 보여준다.
    socket.emit("userlist", rooms[socket.roomNum].users);
  });

  socket.on("exit", function(data){
    var users = rooms[socket.roomNum].users;
    //방에 접속중인 소켓들은 io.sockets라는 배열 안에 보관된다.
    //socket.join()은 소켓들에게 하나의 방(그룹)를 지정해준다.
    //socket.leave()는 소켓을 방에서 나오도록 해준다.
    socket.leave(data.name);
    for(var i in users){
      //in을 쓰게 되면 i는 배열의 인덱스
      if(users[i].id == socket.id){
        users.splice(i, 1); //splice(인덱스, 갯수) : i번지부터 1개의 socket.id를 삭제
        break;
      }
    }
    io.sockets.in(data.name).emit("exit", data.id);
  });
  socket.on("send", function(data){
    //io.sockets[data.to] -> io.to(data.to)
    io.to(data.to).emit("send", {userid:data.userid, msg:data.msg});
  });
});
