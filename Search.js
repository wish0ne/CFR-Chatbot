
var express = require('express');
var app = express();
var client_id = 'cnS9zzj0OZ3xPgHqtaLJ';
var client_secret = 'oQGaxdr7aq';

//data parsing
var data='';
var title='';
var link='';
var category='';
var address='';
var roadAddress='';

//받아와야할 데이터
var place = '성수역'; //사용자 위치
var gender = 'female'; //사용자 성별
var emotion = 'talking'; //사용자 감정
var menu='';

if(gender=='male'){
  if(emotion=='angry'){
    menu='술';
  }
  else if(emotion=='disgust'){
    menu='야식';
  }
  else if(emotion=='fear'){
    menu='한식';
  }
  else if(emotion=='laugh'){
    menu='치킨';
  }
  else if(emotion=='neutral'){
    menu='양식';
  }
  else if(emotion=='sad'){
    menu='중식';
  }
  else if(emotion=='surprise'){
    menu='일식';
  }
  else if(emotion=='smile'){
    menu='고기';
  }
  else if(emotion=='talking'){
    menu='술';
  }
  else{
    menu='';
  }
}
else if(gender=='female'){
  if(emotion=='angry'){
    menu='고기';
  }
  else if(emotion=='disgust'){
    menu='디저트';
  }
  else if(emotion=='fear'){
    menu='한식';
  }
  else if(emotion=='laugh'){
    menu='일식';
  }
  else if(emotion=='neutral'){
    menu='중식';
  }
  else if(emotion=='sad'){
    menu='야식';
  }
  else if(emotion=='surprise'){
    menu='중식';
  }
  else if(emotion=='smile'){
    menu='치킨';
  }
  else if(emotion=='talking'){
    menu='카페';
  }
  else{
    menu='';
  }
}
else{
  menu='';
}

var query= place + ' ' + menu + ' 맛집'; //검색 원하는 문자열
var display = '1'; //검색 결과 출력 건수. 최대 5개
var start = '1'; //검색 시작 위치. 1만 가능
var sort = 'comment'; //정렬 옵션 (random : 유사도순, comment : 카페/블로그 리뷰 개수 순)

app.get('/search/local', function (req, res) {
   var api_url = 'https://openapi.naver.com/v1/search/local?query=' + encodeURI(query)+ '&display='+encodeURI(display) + '&start='+encodeURI(start)+'&sort='+encodeURI(sort); 
   var request = require('request');
   var options = {  
       url: api_url,
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
   request.get(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       console.log(body);

       //데이터 파싱
       data=JSON.parse(body);
       title=data.items[0].title;
       console.log(title);

       link=data.items[0].link;
       console.log(link);

       category=data.items[0].category;
       console.log(category);

       address=data.items[0].address;
       console.log(address);

       roadAddress=data.items[0].roadAddress;
       console.log(roadAddress);
     

       res.end(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
 });

 app.listen(3000, function () {
   console.log('app listening on port 3000!');
   console.log(query);

 });

 
  