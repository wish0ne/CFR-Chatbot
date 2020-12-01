var express = require('express');
var app = express();
var client_id = 'v3M4wjolGLkrvNA3GUIW';
var client_secret = 'fKF6vjkWhE';
var fs = require('fs');

app.get('/', function (req, res) {
   var request = require('request');
   //var api_url = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
   var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

   var _formData = {
     image:'image',
     image: fs.createReadStream(__dirname + "\\IU.jpg") // FILE 이름
   };
    var _req = request.post({url:api_url, formData:_formData,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}}).on('response', function(response) {
       console.log(response.statusCode) // 200
       console.log(response.headers['content-type'])
    });
    console.log( request.head  );
    _req.pipe(res); // 브라우저로 출력
 });

 app.listen(8080, function () {
   console.log('http://127.0.0.1:8080/face app listening on port 8080!');
 });