const router = require('express').Router();
module.exports = router;

router.post("/signin", function(request, response){
  pool.getConnection(function(error, conn){
    //pool.query()함수로 바로 쿼리를 날릴 수 있어 getConnection은 생략 가능하다.
    if(error){
      next(error);
    }else{
      conn.query("select * from user where id = ?", [request.body.id], function(error, data){
        if(error){next(error);}else{
          if(data.length == 0 || data[0].password != request.body.password){
            response.send('n');//로그인 실패
          }else{
            request.session.user = data[0];
            response.send('y');
          }
        }
      });

    }
  });
});

router.get("/signup", function(request, response, next){
  response.render('signup');
});

router.post("/signup", function(request, response, next){
  pool.getConnection(function(error, conn){
    if(error){next(error);}else{
      conn.query("insert into user values(?, ?, ?, curdate())", [request.body.id, request.body.password, request.body.name], function(error, data){
        if(error){next(error);}else{
          response.render('main');
        }
      });
    }
  });
});

router.post("/doubleCheck", function(request, response, next){
  pool.getConnection(function(error, conn){
    if(error){next(error);}else{
      conn.query("select count(*) cnt from user where id= ?", [request.body.id], function(error, data){
        if(error){next(error);}else{
          if(data[0].cnt == 0){
            response.send('n');
          }else{
            response.send('y');
          }
        }
      });
    }
  });
});
