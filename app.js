global.pool = require('./db/db_pool');
//db_pool.js로부터 pool을 받아온다.
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
//npm i express-session --save
const http = require('http');
//express에는 소켓 기능이 없으므로, http모듈을 별도로 선언해 주어야 한다.
const socketio = require('socket.io'); //java의 웹소켓과 같다.
//npm i socket.io
const app = express();
const server = http.createServer(app);
global.io = socketio.listen(server); //클라이언트의 요청에 대해 서버가 응답해줄 수 있다. http + 소켓
server.listen(80, function(){console.log("Server start");});

app.set('views', "./views");
app.set('view engine', "pug");
app.set("view cache", false);

//정적자원 위치 설정
app.use(express.static("./resources"));
app.use(session({
  key:'sid',
  secret:"increpas", //암호화 키
  resave:false, //세션에 변동이 없어도 계속 저장할지 설정
  saveUninitialized:true, //초기화되지 않은 세션 정보도 저장할지 설정
  cookie:{
    maxAge: 1000*60*20 //로그인 유지 20분 설정
  }
}));

app.use(bodyParser.urlencoded({extended:false})); //extended:false는 파라미터로 문자열만 받아오겠다는 뜻

app.use("(/menu*)|(/admin*)|(/comment*)|(/chat*)|(/msg*)", function(request, response, next){
  if(!request.session.user){
    response.render('errorpage.pug', {msg:"로그인 후 이용하세요", url:"/"});
  }else{
    next();
  }
});

app.use(function(request, response, next){
  response.locals.user = request.session.user;
  //response.locals에는 session에 있는 객체를 담을 수 있다. 모든 요청에 대해서 진행된다.
  next();
});

app.get("/", function(request, response){
  response.render('main', {user:request.session.user});
});

app.use("/user", require('./routes/user'));
app.use("/chat", require('./routes/chat'));
app.use("/msg", require('./routes/msg'));
app.use("/ticket", require("./routes/ticket"));
app.use("/bbs", require("./routes/bbs"));

//404, 500 에러 처리 등록
app.use(function(request, response, next){
  var error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(function(error, request, response, next){
  //error를 넘겨받은 요청은 error가 맨 앞자리에 온다.
  if(error.status == 404){
    response.render("error404.pug");
  }else{
    response.render("error500.pug");
  }
});
