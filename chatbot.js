var express = require('express');
var client_id = 'your cfr client id';//cfr api client id를 입력하세요
var client_secret = 'your cfr client secret';//cfr api client secret을 입력하세요
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'your chatbot token' //line chatbot api token을 입력하세요
const SECRET = 'your chatbot secret' //line chatbot api secret을 입력하세요
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "your domain" //도메인을 입력하세요
const sslport = 23023;
const line = require('@line/bot-sdk');

const bodyParser = require('body-parser');
const { assert } = require('console');
var app = express();
app.use(bodyParser.json());

var usingMessage = ''
var content_id = ''
var imgDownloaded = false;
var downloadedImg = ''

//search
var search_client_id = 'your search client id';//naver search local api client id를 입력하세요
var search_client_secret = 'your search client secret';//naver search local api client secret 입력하세요

//data parsing
var data='';
var title='';
var link='';
var category='';
var address='';
var roadAddress='';
var menu='';

var arrmenu=new Array('술','야식','한식','치킨','양식','중식','일식','고기','디저트','카페');
  
app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
    var text = eventObj.message.text;

    // request log
    if (!(eventObj.message.type == 'image')) {
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);
    }

    if (eventObj.message.type == 'location') {
        
        //위치 받아서 맛집 추천해주는 함수
        var chatbotaddress=eventObj.message;
        var chatbotdata1=chatbotaddress.address; 
        var chatbotdata2=chatbotdata1.split(' ');
        var place=chatbotdata2[3];
        
        console.log(place);
       
        var query= place + ' ' + menu + ' 맛집'; //검색 원하는 문자열 
        RecommendationResult(eventObj.replyToken, query);

        res.sendStatus(200);
    } else if (text == 'Cfr:Yes') {
        QuickReplyCfrYes(eventObj.replyToken);
        res.sendStatus(200);
    } else if (text == 'Cfr:No') {
        QuickReplyCfrNo(eventObj.replyToken);
        res.sendStatus(200);
    } else if (text == '랜덤 추천' || text == '위치 기반 추천') {
      if (text == '랜덤 추천') {

        //랜덤으로 맛집 추천해주는 함수
        var randomMenu=Math.floor(Math.random()*10);
        var query = randomMenu+' 맛집';
        RecommendationResult(eventObj.replyToken, query);

        res.sendStatus(200);
      }
        else { 
            SendingLocation(eventObj.replyToken);
            res.sendStatus(200);
        }
    } else if (eventObj.message.type == 'image') {
        content_id = eventObj.message.id;
        const downloadPath = path.join(__dirname, 'sample.jpg');
        downloadContent(content_id, downloadPath);
        //downloadedImg = content_id;
        //imgDownloaded = true;
        Checking(eventObj.replyToken);
        res.sendStatus(200);
    } else if (text == 'ㅇ') {
        //사진으로 얼굴 인식해주는 함수
        imgtodata('sample.jpg');
        SendingLocation(eventObj.replyToken);
        res.sendStatus(200);
    }
    else { 
        usingMessage = text;
        initReply(eventObj.replyToken);
        res.sendStatus(200);
    }

});

const quickReplyLocation = {
    "items": [
        {
            "type": "action",
            "action": {
              "type": "location",
              "label": "위치 입력"
            }
        }
    ]
};

const quickReplyCfrYes = {
    "items": [
      {
        "type": "action",
        "action": {
          "type": "cameraRoll",
          "label": "사진 가져오기"
        }
      },
      {
        "type": "action",
        "action": {
          "type": "camera",
          "label": "사진 찍기"
        }
      },
    ]
  };

const quickReplyCfrNo = {
    items: [
    /*
      {
        "type": "action",
        "action": {
            "type": "message",
            "label": "weather",
            "text": "날씨"
        }
      },
      {
        "type": "action",
        "action": {
            "type": "message",
            "label": "menu",
            "text": "메뉴"
        }
      },
    */
      {
        "type": "action",
        "action": {
            "type": "message",
            "label": "random",
            "text": "랜덤 추천"
        }
      },
      {
        "type": "action",
        "action": {
            "type": "message",
            "label": "location",
            "text": "위치 기반 추천"
        }
      }
    ]
  };

//기본 reply
function initReply (replyToken) {
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken":replyToken,
                "messages":[
                    {
                        "type": "sticker",
                        "packageId": "11537",
                        "stickerId": "52002738"
                    },
                    {
                        "type": "text",
                        "text": "안녕하세요.\nCFR을 이용한 얼굴인식 맛집 추천봇입니다."
                    },
                    {
                        "type": "template",
                        "altText": "얼굴 인식을 위해 사진을 가져오시겠습니까?",
                        "template": {
                            "type": "confirm",
                            "text": "얼굴 인식을 위해 사진을 가져오시겠습니까?",
                            "actions": [
                                {
                                    "type": "message",
                                    "label": "Cfr:Yes",
                                    "text": "Cfr:Yes"
                                },
                                {
                                    "type": "message",
                                    "label": "Cfr:No",
                                    "text": "Cfr:No"
                                }
                            ]
                        }
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

//위치 입력 reply
function SendingLocation(replyToken) {
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "text": "위치를 입력해주세요.",
                        "quickReply": quickReplyLocation
                    }
                ]
            },
            body: request
        },(error, response, body) => {
            console.log(body)
    });
}

//cfr 이용할 때 reply
function QuickReplyCfrYes(replyToken) {
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "text": "사진을 입력해주세요. 얼굴 인식이 되지 않을 경우 위치 기반으로 추천됩니다.",
                        "quickReply": quickReplyCfrYes
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

//cfr 이용하지 않을 때 reply
function QuickReplyCfrNo (replyToken) {
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "text": "랜덤 추천 옵션을 선택해주세요.",
                        "quickReply": quickReplyCfrNo
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

function Checking (replyToken) {
    request.post(
        {
            url: TARGET_URL,
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "label": "계속 진행",
                        "text": "계속 진행하시려면 'ㅇ'을 입력해주세요."
                    },
                ],
            }
        },(error, response, body) => {
            console.log(body)
        });
}


//추천 결과 + Search
function RecommendationResult(replyToken, query) {
  
  console.log(query);
  var display = '1'; //검색 결과 출력 건수. 최대 5개
  var start = '1'; //검색 시작 위치. 1만 가능
  var sort = 'comment'; //정렬 옵션 (random : 유사도순, comment : 카페/블로그 리뷰 개수 순)

  var api_url = 'https://openapi.naver.com/v1/search/local?query=' + encodeURI(query) + '&display=' + encodeURI(display) + '&start=' + encodeURI(start) + '&sort=' + encodeURI(sort);
  var options = {
    url: api_url,
    headers: { 'X-Naver-Client-Id': search_client_id, 'X-Naver-Client-Secret': search_client_secret }
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      console.log(body);
      
      //데이터 parsing
      data = JSON.parse(body);
      title = data.items[0].title;
      console.log(title);

      link = data.items[0].link;
      console.log(link);

      category = data.items[0].category;
      console.log(category);

      address = data.items[0].address;
      console.log(address);

      roadAddress = data.items[0].roadAddress;
      console.log(roadAddress);
    
      var x = Number(data.items[0].mapx);
      var y = Number(data.items[0].mapy);
        
      var longitude = TMtoWGS(x, y)[0];
      var latitude = TMtoWGS(x, y)[1];

      request.post(
        {
          url: TARGET_URL,
          headers: {
            'Authorization': `Bearer ${TOKEN}`
          },
          json: {
            "replyToken": replyToken,
            "messages": [
                {
                    "type":"location",
                    "title": title,
                    "address": address,
                    "latitude": latitude,
                    "longitude": longitude
                },
                {
                    "type": "text",
                    "text": "맛집 이름: " + title
                },
                {
                    "type":"text",
                    "text": "맛집 주소: " + address
                }
            ]
          }
        }, (error, response, body) => {
          console.log(body)
        });

    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  })

}


imgtodata = function(dir) {
    var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

    var _formData = {
        image: 'image',
        image: fs.createReadStream(path.join(__dirname, dir)) // FILE 이름
    };

    request.post({
        url: api_url,
        formData: _formData,
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret
        }
    }, (err, response, body) => {
        console.log(response.statusCode); // 200
        //console.log(response.headers['content-type'])
        console.log(body);
        var cfrdata = JSON.parse(body);

        var facenum = cfrdata.info.faceCount;
        //인식된 얼굴이 없을 때
        if (facenum == 0) {
            menu=''
        } 
        //얼굴 1개 이상
        else {
            //제일 잘 인식되는 얼굴 기준
            var cfrgender = cfrdata.faces[0].gender.value; //CFR의 성별 데이터 (json)
            var cfremotion = cfrdata.faces[0].emotion.value; //CFR의 감정 데이터 (json)

            var gender = cfrgender; //사용자 성별
            var emotion = cfremotion; //사용자 감정

            console.log(facenum);
            console.log(gender);
            console.log(emotion);

            if (gender == 'male') {
                if (emotion == 'angry') {
                    menu = arrmenu[0];
                } else if (emotion == 'disgust') {
                    menu = arrmenu[1];
                } else if (emotion == 'fear') {
                    menu = arrmenu[2];
                } else if (emotion == 'laugh') {
                    menu = arrmenu[3];
                } else if (emotion == 'neutral') {
                    menu = arrmenu[4];
                } else if (emotion == 'sad') {
                    menu = arrmenu[5];
                } else if (emotion == 'surprise') {
                    menu = arrmenu[6];
                } else if (emotion == 'smile') {
                    menu = arrmenu[7];
                } else if (emotion == 'talking') {
                    menu = arrmenu[0];
                } else {
                    randomMenu=Math.floor(Math.random()*10);
                    menu = arrmenu[randomMenu];
                }
            } 
            else if (gender == 'female') {
                if (emotion == 'angry') {
                    menu = arrmenu[7];
                } else if (emotion == 'disgust') {
                    menu = arrmenu[8];
                } else if (emotion == 'fear') {
                    menu = arrmenu[2];
                } else if (emotion == 'laugh') {
                    menu = arrmenu[6];
                } else if (emotion == 'neutral') {
                    menu = arrmenu[5];
                } else if (emotion == 'sad') {
                    menu = arrmenu[1];
                } else if (emotion == 'surprise') {
                    menu = arrmenu[5];
                } else if (emotion == 'smile') {
                    menu = arrmenu[3];
                } else if (emotion == 'talking') {
                    menu = arrmenu[9];
                } else {
                    randomMenu=Math.floor(Math.random()*10);
                    menu = arrmenu[randomMenu];
                }
            } else {
                randomMenu=Math.floor(Math.random()*10);
                menu = arrmenu[randomMenu];
            }

            console.log(menu);
        }
    });
}

//좌표 변경
const proj4 = require('proj4');
function TMtoWGS(x,y){
    var to = 'WGS84'
    var from = 'TM128'
 
    proj4.defs('WGS84', "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
    proj4.defs('TM128', '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
 
    var xy = [x, y];
    var result = proj4(from, to, xy);
 
    return result;
}

//사용자가 보낸 사진 저장
const config = ({
    channelAccessToken: `${TOKEN}`,
    channelSecret: `${SECRET}`,
});

const client = new line.Client(config);
function downloadContent(messageId, downloadPath) {
    return client.getMessageContent(messageId)
      .then((stream) => new Promise((resolve, reject) => {
        const writable = fs.createWriteStream(downloadPath);
        stream.pipe(writable);
        stream.on('end', () => resolve(downloadPath));
        stream.on('error', reject);
      }));
}


try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
    if (usingMessage == '') {
        HTTPS.createServer(option, app).listen(sslport, () => {
            console.log(`[HTTPS] Server is started on port ${sslport}`);
        });
    }
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
}