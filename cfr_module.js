var client_id = 'v3M4wjolGLkrvNA3GUIW';
var client_secret = 'fKF6vjkWhE';
var fs = require('fs');
var request = require('request');

exports.imgtodata=function(dir){
   var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

   var _formData = {
     image:'image',
     image: fs.createReadStream(__dirname + dir) // FILE 이름
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

       return {gender:gender,emotion:emotion};
    });
  }