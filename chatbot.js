var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'w5i8sURqF5bof6DWeB87n+oCeWrYaFf7a5YZzfzN1jeITIlZ3PcOmZRcdGCo/djTuHhNxybfJ69y7Jex+7tipBNRynngfyWX9CK1L3EupuhnX8rubeCmJda7HvsQWXVo8ZDcwl2aLwXsE3kiYF2qEwdB04t89/1O/w1cDnyilFU='
const SECRET = 'b0b4501ebc2813a2b0e586293a35b466'
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "www.osstest237.ml"
const sslport = 23023;
const line = require('@line/bot-sdk');

const bodyParser = require('body-parser');
const { assert } = require('console');
var app = express();
app.use(bodyParser.json());

var usingMessage = ''
var content_id = ''
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

        RecommendationResult(eventObj.replyToken);
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

            RecommendationResult(eventObj.replyToken);
            res.sendStatus(200);
        }
        else { 
            SendingLocation(eventObj.replyToken);
            res.sendStatus(200);
        }
    } else if (eventObj.message.type == 'image') {
        content_id = eventObj.message.id;
        const downloadPath = path.join(__dirname, `${content_id}.jpg`);
        downloadContent(content_id, downloadPath);
        
        //사진으로 얼굴 인식해주는 함수

        SendingLocation(eventObj.replyToken);
        res.sendStatus(200);
    } else { 
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
                        "text": "안녕하세요.\nCFR을 이용한 경기도 맛집 추천봇입니다."
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
            }
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
                        "text": "사진을 입력해주세요.",
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

function RecommendationResult(replyToken) {
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
                        "type": "imagemap",
                        // 이미지 불러올 수 없습니다 뜸
                        "baseUrl": "https://www.flaticon.com/free-icon/food-store_2934069?term=restaurant&page=1&position=7&related_item_id=2934069",
                        "altText": "이미지를 누르시면 해당 가게로 이동합니다.",
                        "baseSize": {
                            "width": 1040,
                            "height": 1040
                        },
                        "actions": [
                            {
                                "type": "uri",
                                "linkUri": `${link}`, // 가게 링크
                                "area": {
                                    "x":0,
                                    "y":0,
                                    "width":1040,
                                    "height":1040
                                }
                            }
                        ]
                    },
                    {
                        "type": "text",
                        "text": "기타 결과 출력" // 정보 수정
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
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