var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'w5i8sURqF5bof6DWeB87n+oCeWrYaFf7a5YZzfzN1jeITIlZ3PcOmZRcdGCo/djTuHhNxybfJ69y7Jex+7tipBNRynngfyWX9CK1L3EupuhnX8rubeCmJda7HvsQWXVo8ZDcwl2aLwXsE3kiYF2qEwdB04t89/1O/w1cDnyilFU='
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "www.osstest237.ml"
const sslport = 23023;

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var usingMessage = ''

app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
   // var source = eventObj.source;
   // var message = eventObj.message;
    var text = eventObj.message.text;

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    if (text == 'Cfr:Yes') {
        QuickReplyCfrYes(eventObj.replyToken);
        res.sendStatus(200);
    } else if (text == 'Cfr:No') {
        QuickReplyCfrNo(eventObj.replyToken);
        res.sendStatus(200);
    } else if (eventObj.message.type == 'image') {
        console.log('image url: ', eventObj.message.contentProvider);
        console.log('image url: ', eventObj.message.originalContentUrl);
        console.log('image url: ', eventObj.message.previewImageUrl);
        console.log('id:', eventObj.message.id);
        res.sendStatus(200);
    } 
    else {
        usingMessage = text;
        request.post(
            {
                url: TARGET_URL,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
                json: {
                    "replyToken":eventObj.replyToken,
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
                        },
                    ]
                }
            },(error, response, body) => {
                console.log(body)
            });
        res.sendStatus(200);
    }

});

const quickReplyYes = {
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
      {
        "type": "action",
        "action": {
          "type": "location",
          "label": "위치"
        }
      }
    ]
  };

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
                        "text": "사진 입력",
                        "quickReply": quickReplyYes
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
}

const quickReplyNo = {
    items: [
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
      {
        "type": "action",
        "action": {
            "type": "message",
            "label": "random",
            "text": "랜덤"
        }
      }
    ]
  };

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
                        "text": "맛집 추천 옵션 선택",
                        "quickReply": quickReplyNo
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
        });
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