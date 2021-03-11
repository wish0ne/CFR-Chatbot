# CFR Chatbot Service

얼굴인식 API를 이용하여 사용자의 감정, 성별에 적합한 맛집을 추천해주는 챗봇 서비스입니다. 

### Bulit with
* [Node.js](https://nodejs.org/ko/)
* [Express](https://expressjs.com/)
* [Line Messaging API](https://developers.line.biz/en/services/messaging-api/)
* [CLOVA Face Recognition API](https://developers.naver.com/products/clova/face/)
* [Naver Search Local API](https://developers.line.biz/en/services/messaging-api/)


## How to use chatbot
<img src="image/LINE_APP.png" width="200" height="200"></img>
<img src="image/QR_code.png" width="200" height="200"></img>

1. QR 코드를 이용하여 Line에서 챗봇을 추가해주세요.
2.  CFR을 이용한 얼굴인식 기반으로 추천맛집을 제공받을지 선택해주세요


<br>
❌ 얼굴인식을 이용하지 않는 경우 ❌<br>
1. 랜덤 추천과 위치기반 추천이 가능합니다. 둘 중 원하는 방법을 선택해주세요.<br>
2. 위치기반 추천을 선택하셨다면 검색하고자 하는 위치를 입력해주세요. <br>
3. 랜덤 추천을 선택하시면 무작위로 추천 맛집이 제공됩니다. 🍜 <br>
4. 위치기반 추천을 선택하시면 검색하신 위치를 기반으로 한 추천 맛집이 제공됩니다. 🍰

<br>
⭕ 얼굴인식을 사용하는 경우 ⭕<br>
1. 얼굴을 인식할 사진을 업로드해주세요.<br>
2. 사진에서 얼굴 유무를 인식하여 인식되지 않으면 얼굴인식을 이용하지 않는 위치기반 추천으로 돌아갑니다.<br>
3. 얼굴을 인식하여 사용자의 감정과 성별을 파악합니다. <br>
4. 사용자 위치를 입력해주세요. 원하는 위치의 맛집을 검색할 수 있어요!<br>
5. 사용자 감정과 성별, 위치를 기반으로 한 맛집이 제공됩니다.🥘

<br>
<h4 align="center">📜한눈에 살펴보는 챗봇 사용법📜</h4>
<p align="center"><img src="image/chabotAlgorithm .png"></img></p>

## How to develop
1. 필요한 API Key들을 발급받아 주세요.
<br>
[Line Messaging API](https://developers.line.biz/en/services/messaging-api/)<br>
[CLOVA Face Recognition API](https://developers.naver.com/products/clova/face/)<br>
[Naver Search Local API](https://developers.line.biz/en/services/messaging-api/)<br>
<br>

2. 이 Repository를 clone해 주세요.
```
git clone http://khuhub.khu.ac.kr/2018102237/cfr-chatbot.git
```
3. 필요한 npm module을 설치해 주세요.
```
npm install
```
4. chatbot.js 파일을 수정해주세요.
```javascript
var client_id = 'your cfr client id';//cfr api client id를 입력하세요
var client_secret = 'your cfr client secret';//cfr api client secret을 입력하세요
const TOKEN = 'your chatbot token' //line chatbot api token을 입력하세요
const SECRET = 'your chatbot secret' //line chatbot api secret을 입력하세요
const domain = "your domain" //도메인을 입력하세요
var search_client_id = 'your search client id';//naver search local api client id를 입력하세요
var search_client_secret = 'your search client secret';//naver search local api client secret 입력하세요
```
5. chatbot.js를 실행한 후, 정상적으로 작동되는지 확인하세요.
<br>

### 참여하기
이 프로젝트는 오픈소스입니다. CFR Chatbot을 발전시켜주세요! 👩‍💻

1. 이 프로젝트를 fork 해 주세요. `git fork ssh://git@khuhub.khu.ac.kr:12959/2018102237/cfr-chatbot.git`
2. 새 branch를 생성해주세요. `git checkout Update`
3. 변경사항을 commit해 주세요. `git commit -m 'New Update'`
4. 생성한 branch에 push해 주세요. `git push origin Update`
5. merge request를 요청해주세요. 당신도 이 프로젝트에 기여할 수 있습니다!
 

## License
이 프로젝트는 MIT License를 따르고 있습니다. 자세한 내용은 [License](http://khuhub.khu.ac.kr/2018102237/cfr-chatbot/blob/master/LICENSE)를 확인해 주세요.

## Contact
장소원  wish@khu.ac.kr<br>
조아혜  whdkgp97@khu.ac.kr<br>
이다은  daeun197@khu.ac.kr
