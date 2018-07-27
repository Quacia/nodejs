const router = require('express').Router();
module.exports = router;

var seats = [
  [1,1,0,1,1,0,0,0,0,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1],
  [1,1,0,1,1,1,1,1,1,1,1,0,1,1]
]; //2차원 배열 선언, 1은 좌석, 0은 통로

router.get("/", function(request, response, next){
  response.render("ticket/view");
});

//io는 소켓을 배열로 가져온다.
io.sockets.on("connection", function(socket){
  socket.on("seats", function(data){
    socket.emit("seats", seats);
  });

  socket.on("reserve", function(data){
    seats[data.x][data.y] = 2;
    io.sockets.emit("reserved", data);
  });
});
