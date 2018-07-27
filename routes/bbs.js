const router = require('express').Router();

module.exports = router;

router.get("/list", function(request, response, next){
  pool.query("select count(*) count from bbs", function(error, data){
    if(error){next(error);}else{
      var totalCount = data[0].count;
      //한 화면에 뿌려질 리스트의 갯수
      var entityInPage = 3;
      //한 화면에 뿌려질 페이지 갯수
      var pages = 3;
      //현재 페이지, request.query.page 가 null 이면 1이 변수에 들어간다.
      var page = request.query.page || 1;

      var totalPage = Math.ceil(totalCount/pages);
      //set : startPage와 endpage까지의 갯수. 한 화면에 3 페이지씩 페이징이 되면 1~3, 4~6페이지가 한 세트다.
      var curSet = Math.ceil(page / pages);
      //마지막 게시물 번호
      var end = totalCount - (page-1) * entityInPage;
      var start = end - entityInPage + 1;

      var query = "";
      query += "select a.* from ";
      //:= 대입연산자. 쿼리 내에서 변수를 선언하고 값을 대입한다.
      //mysql에서 서브쿼리 선언 시, 서브쿼리에는 이름을 지정해주어야 한다.
      query += "(select @rnum:=@rnum+1 as rnum, b.id, b.title, ";
      query += "b.u_id, b.content, DATE_FORMAT(regdate, '%Y-%m-%d') regdate ";
      query += "from bbs b, (select @rnum:=0) r) a ";
      query += "where rnum between ? and ? order by rnum desc";
      pool.query(query, [start, end], function(error, data){
        if(error){next(error);}else{
          var startPage = ((curSet - 1)* pages) + 1;
          var endPage = startPage + pages -1;
          if(endPage > totalPage){
            endPage = totalPage;
          }

          response.render('bbs/list', {
            list:data,
            startPage:startPage,
            endPage:endPage,
            pages:pages,
            page:page,
            totalPage:totalPage,
            base:"/bbs/list"
          });
        }
      });
    }
  });
});
router.get("/view/:id", function(request,response, next){
  pool.query("select * from bbs where id = ?", [request.params.id], function(error, data){
    if(error){console.log(error);}else{
      response.render('bbs/view', {item:data[0]});
    }
  });
});

router.get("/update/:id", function(request, response, next){
  pool.query("select * from bbs where id = ?", [request.params.id], function(error, data){
    if(error){console.log(error);}else{
      response.render('bbs/update', {item:data[0]});
    }
  });
});

router.post("/update", function(request, response, next){
  pool.query("update bbs set title = ?, content = ? where id = ?", [request.body.title, request.body.content, request.body.id], function(error,data){
    if(error){console.log(error);}else{
      response.redirect('/bbs/list');
    }
  });
});

router.get("/delete/:id", function(request, response, next){
  pool.query("delete from bbs where id = ?", [request.params.id], function(error,data){
    if(error){console.log(error);}else{
      response.redirect("/bbs/list");
    }
  });
});

router.get("/add", function(request, response, next){
  response.render("bbs/add");
});

router.post("/add", function(request, response, next){
  pool.query("insert into bbs(title, u_id, content, regdate) values(?, ?, ?, curdate())", [request.body.title, request.body.u_id, request.body.content], function(error,data){
    if(error){console.log(error);}else{
      response.redirect("/bbs/list");
    }
  });
});
