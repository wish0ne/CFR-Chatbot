var client_id = 'v3M4wjolGLkrvNA3GUIW';
var client_secret = 'fKF6vjkWhE';
var fs = require('fs');
var request = require('request');
const path = require('path');
var express = require('express');
var app = express();
var domain = "www.osstest237.ml"
const sslport = 23023;
const HTTPS = require('https');

exports.imgtodata = function(dir){
   var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

   var _formData = {
     image:'image',
     image: fs.createReadStream(path.join(__dirname, dir)) // FILE 이름
   };

    request.post(
      { url:api_url, 
        formData:_formData,
        headers: {'X-Naver-Client-Id':client_id,
                 'X-Naver-Client-Secret': client_secret}
      }, (err,response,body) =>{
       console.log(response.statusCode); // 200
       //console.log(response.headers['content-type'])

       data=JSON.parse(body);
       gender=data.faces[0].gender.value;
       emotion=data.faces[0].emotion.value

       console.log(gender);
       console.log(emotion);

       //return {gender:gender,emotion:emotion};
    });
  }

  try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
}

//imgtodata('./test3.jpg');