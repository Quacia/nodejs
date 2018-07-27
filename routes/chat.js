const router = require('express').Router();
module.exports = router;

router.get("/", function(request, response, next){
  response.render("chat/view");
});

//io는 소켓을 배열로 가져온다.
io.sockets.on("connection", function(socket){
  //클라이언트가 서버로 연결하면(io.connect()) 클라이언트와 서버 둘 다 소켓이 생기며 해당 콜백함수가 실행된다.

  socket.on("broadcast", function(data){
    //console.log(data);
    io.sockets.emit("broadcast", data);
  });
});
