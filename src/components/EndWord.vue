<template>
    <div id="endword">

        <transition name="tr" mode="out-in">
            <div class="wait-room" v-if="!game" key="wait-room">
                <div class="left">
                    <div class="title" style="border-radius : 10px 0px 0px 0px">방메뉴</div>
                    <div class="room-menu">
                        <div class="room-info">{{roomInfo.roomName}}({{roomInfo.roomId}})</div>
                        <select class="form-select" aria-label="Default select example" id="round" v-model="round" v-if="roomInfo.host === socket.id">
                            <option value="0">라운드</option>
                            <option value="1">1라운드</option>
                            <option value="2">2라운드</option>
                            <option value="3">3라운드</option>
                        </select>
                        <select class="form-select" aria-label="Default select example" id="time" v-model="limitTime" v-if="roomInfo.host === socket.id">
                            <option value="0">제한시간</option>
                            <option value="5">5초</option>
                            <option value="10">10초</option>
                            <option value="15">15초</option>
                        </select>   
                        <div class="room-button">
                            <button type="button" class="btn btn-secondary" @click="gameStart" v-if="roomInfo.host === socket.id">시작하기</button>
                            <button type="button" class="btn btn-secondary" @click="ready" v-else>준비하기</button>
                            <button type="button" class="btn btn-secondary" @click="outRoom">나가기</button>
                        </div>
                    </div>
                    <div class="title">유저</div>
                    <div class="user-list">
                        <div class="user-content">
                            <div class="user" v-for="user in  userList" :key="user" @click="kick(user.id)" :class="{my:user.id === socket.id}">
                                <i class="fas fa-crown" v-if="roomInfo.host === user.id"></i>
                                <i class="fas fa-user-times" v-else-if="!user.ready"></i>
                                <i class="fas fa-user-check" v-else></i>
                                {{user.nickName}}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="right">
                    <div class="public-chat">
                        <div class="title" style="border-radius : 0px 10px 0px 0px">채팅</div>
                        <div class="chating">
                            <div class="chat" v-for="chat in chatList" :key="chat" :class="{my:chat.id === socket.id}"> 
                                <div class="systemChat" v-if="chat.id === 'SYSTEM'"><b>{{chat.msg}}</b></div>
                                <div class="userChat" v-else>{{chat.nickName}} : {{chat.msg}}</div>
                            </div>
                        </div>
                        <div class="send">
                            <input type="text" class="form-control" placeholder="message" aria-label="message" aria-describedby="basic-addon1" v-model="msgInput" @keydown.enter="sendMsg">
                            <button type="button" class="btn btn-outline-dark" @click="sendMsg">>></button>
                        </div>
                    </div>
                </div>
            </div>



            <div class="play-room" v-if="game" key="play-room">
                <div class="title info" style="border-radius : 10px 10px 0px 0px">
                    <h6>{{roomInfo.roomName}}({{roomInfo.roomId}})</h6>
                    <h6>끝말잇기</h6>
                    <h6>참여자{{roomInfo.inUser}}/{{roomInfo.max}}</h6>
                    <h6>{{round}}라운드</h6>
                    <h6>{{limitTime}}초</h6>
                </div>

                <div class="guide">
                    <div class="content">
                        <h6>{{startWord}}</h6>
                        <div class="word-time">
                            <div class="end-word" v-if="phoneticRule !== null">{{endWord}}({{phoneticRule}})</div>
                            <div class="end-word" v-else>{{endWord}}</div>
                            <div class="time">
                                <progress :max="limitTime" :value="time"></progress>
                                <div class="num" v-if="time >= 0">{{time}}</div>
                                <div class="num" v-else>0</div>
                            </div>
                            <input type="text" id="input-word" v-if="userList[page].id === socket.id" v-model="inputWord" @keydown.enter="input" class="form-control" placeholder="단어를 입력해주세요." aria-label="Username" aria-describedby="basic-addon1">
                        </div>
                    </div>
                </div>

                <div class="word-list">
                    <div class="words">
                        <div class="word" v-for="word in wordViewList" :key="word">
                            <div class="text">{{word.name}}</div>
                            <div class="meaning">{{word.content}}</div>
                        </div>
                    </div>
                </div>

                <div class="user-list">
                    <div class="content">
                        <div class="user" v-for="user in userList" :key="user" :class="{now:userList[page].id === user.id}">
                            <div class="user-info">
                                <i class="fas fa-user"></i>
                                <div class="score">{{user.score}}</div>    
                            </div>
                            <div class="name">{{user.nickName}}</div>
                        </div>
                    </div>
                </div>

                <div class="public-chat">
                    <div class="title">채팅</div>
                    <div class="chating">
                        <div class="chat" v-for="chat in chatList" :key="chat" :class="{my:chat.id === socket.id}"> 
                            <div class="systemChat" v-if="chat.id === 'SYSTEM'"><b>{{chat.msg}}</b></div>
                            <div class="userChat" v-else>{{chat.nickName}} : {{chat.msg}}</div>
                        </div>
                    </div>
                    <div class="send">
                        <button type="button" class="btn btn-outline-dark" @click="outRoom">나가기</button>
                        <input type="text" class="form-control" placeholder="message" aria-label="message" aria-describedby="basic-addon1" v-model="msgInput" @keydown.enter="sendMsg">
                        <button type="button" class="btn btn-outline-dark" @click="sendMsg">>></button>
                    </div>
                </div>
            </div>
       </transition>

        <transition name="tr">
            <div class="result-popup" key="result-popup" v-if="gameEnd">
                <div class="content">
                    <div class="result-list">

                    <div class="result" v-for="(user, index) in sortUserList" :key="(user, index)">
                        <div class="index">{{index + 1}}등</div>
                        <div class="name">{{user.nickName}}</div>
                        <div class="score">{{user.score}}점</div>
                    </div>

                    </div>
                    <div class="button-menu">
                        <button type="button" class="btn btn-dark" @click="endGame">확인</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'EndWord',
    mounted(){
        this.socket.removeAllListeners();
        this.socket.on('endwordList', data => {
            this.userList = data;
            if(this.game){
                if(data.length === 1){
                    this.page = 0;
                    this.socket.emit('endwordSolo', this.roomInfo.roomId);
                }
            }
        });
        this.socket.on('roomInfo', data => {this.roomInfo = data;});
        this.socket.on('endwordAwesome', data =>{this.chatList.push(data); this.scroll();});
        this.socket.on('kickResult', ()=>{this.$router.go();})
        this.socket.once('endwordKickResult', ()=>{ location.replace("/#/main"); this.socket.emit('leaveRoom', this.roomInfo.roomId)});
        this.socket.on('endwordGameStart', data=>{
            this.game = true;
            this.chatList = []; 
            this.round = data.round; 
            this.startWord = '가나다'.substr(0, this.round);
            this.endWord = this.startWord.substr(0, 1);
            this.limitTime = data.limitTime; 
            if(this.roomInfo.host === this.socket.id) this.socket.emit('endwordCycle', this.roomInfo.roomId);
            this.cycle();
        });
        this.socket.on('resultWord', data=>{
            this.wordList.push(data.result);
            if(this.wordViewList.length > 4) this.wordViewList.splice(0,1);
            this.wordViewList.push(data.contraction);
            this.socket.emit('endwordScore', {roomId:this.roomInfo.roomId, id:this.userList[this.page].id, le:data.result.name.length, time:this.time});
            this.endWord = data.endword;
            this.phoneticRule = data.phoneticRule;
            this.cycle();
            this.inputWord = '';
        });
        this.socket.on('wrongWord', () => {this.myTurn--; this.systemMsg('없는 단어입니다.'); return;});
        this.socket.on('endwordCycle', () => {
            this.time--; 
            if(this.time < 0){
                if(this.turn !== this.myTurn){
                    let stopUser = this.userList.find(x => x.id === this.socket.id);
                    if(parseInt(this.round) === 1 || this.round === 1) this.socket.emit('endwordCycleStop', stopUser);
                    else this.socket.emit('endwordCycleRestart', stopUser);
                }
            } 
        });
        this.socket.on('endwordGameRestart', data => {
            this.round--;
            this.page = -1;
            this.startWord = this.startWord.substr(1);
            this.inputWord = '';
            this.endWord = this.startWord.substr(0, 1);
            this.phoneticRule = null;
            this.wordList = [];
            this.wordViewList = [];
            this.turn = 0;
            this.myTurn = 0;
            if(this.roomInfo.host === this.socket.id) this.socket.emit('endwordCycle', this.roomInfo.roomId);
            this.cycle();
        });
        this.socket.on('endwordGameEnd', data => {this.gameEnd = true; this.sortUserList = data.sort((a,b)=>{return b.score - a.score});});
        this.socket.on('endwordOut', data => {
            let userIndex = this.userList.findIndex(x => x.id === data);
            if(this.game) if(this.page === userIndex){
                this.time = this.limitTime;
                this.turn = 1;
                this.myTurn = 0;
                let page = this.page + 1;
                if(userIndex + 1 === this.userList.length){this.page = 0; page = this.page;} 
                if(this.userList[page].id !== this.socket.id) this.myTurn++;
            } 
        });
    },  
    data(){
        return{
            socket:this.$socket,
            roomInfo:[],
            userList:[],
            sortUserList:[],
            msgInput:'',
            chatList:[],
            wordList:[],
            wordViewList:[],
            page:-1,
            round:0,
            limitTime:0, //사용자가 정한 제한시간
            time:0, //실제 화면에서 보여지는 제한시간
            inputWord:'',
            startWord:'',
            endWord:'',
            phoneticRule:null,
            turn:0,
            myTurn:0,
            gameEnd:false,
            game:false //게임중인지 판별하는 변수
        }
    },
    methods:{
        sendMsg(){
            this.socket.emit('endwordMsg', {msg:this.msgInput, roomId:this.roomInfo.roomId});
            this.msgInput = '';
        },
        scroll() {
            const msgBox = document.querySelector(".chating");
                let scrollInterval = setInterval(() => {  
                    msgBox.scrollTop = msgBox.scrollHeight;
                    clearInterval(scrollInterval);
            }, 10);
        },
        outRoom(){
            if(confirm("정말 나가시겠습니까?") == true){
                this.$router.options.routes[3].meta.inRoom = false;
                this.socket.emit('roomOut');
                location.replace("/#/main");
            }else{
                return;
            }
        },
        kick(id){
            if(id === this.socket.id || this.userList.findIndex(x => x.id === id && x.admin) >= 0) return;
            if(this.socket.id === this.roomInfo.host || this.userList.findIndex(x => x.id === this.socket.id && x.admin) >= 0){
                if(confirm("추방 하시겠습니까?") == true){
                    this.socket.emit('kickRoom', id);
                }else{
                    return;
                }
            }
        },
        ready(){
            this.socket.emit('endwordReady', this.roomInfo.roomId);
        },
        gameStart(){
            if(this.userList.length < 2){
                alert('게임을 시작하려면 유저가 2명 이상이 필요합니다!');
                return;
            }
            if(this.userList.findIndex(x => this.roomInfo.host !== x.id && !x.ready) >= 0){
                alert('준비를 안한 유저가 있습니다!');
                return;
            }
            if(this.round === 0 || this.limitTime === 0){
                alert('라운드 또는 제한시간을 선택해주세요.');
                return;
            }
            this.socket.emit('endwordGameStart', {roomId:this.roomInfo.roomId ,round:this.round, limitTime:this.limitTime});
        },
        cycle(){
            this.time = this.limitTime;
            this.page++;
            if(this.page === this.userList.length) this.page = 0; 
            this.turn++; 
            if(this.userList[this.page].id !== this.socket.id) this.myTurn++;
        },
        input(){
            if(this.gameEnd) return;
            if(this.userList[this.page].id !== this.socket.id) return;
            if(this.turn === this.myTurn) return;
            if(this.time <= 0) return;
            if(this.inputWord === "") return;
            if(this.inputWord.indexOf(" ") >= 0) return;
            if(this.wordList.findIndex(x => x.name === this.inputWord) >= 0){this.systemMsg('중복되는 단어입니다.'); return;}
            if(this.inputWord.length <= 1){this.systemMsg('2자리 이상의 단어만 사용 가능합니다.'); return;}
            if(this.phoneticRule !== null){
                if(this.inputWord.indexOf(this.endWord) === 0);
                else if(this.inputWord.indexOf(this.phoneticRule) === 0);
                else {this.systemMsg('"' + this.endWord+'(' + this.phoneticRule + ')" 로(으로) 시작하는 단어만 사용가능합니다.'); return;}
            }else{
                if(this.inputWord.indexOf(this.endWord) !== 0){this.systemMsg('"' + this.endWord+'" 로(으로) 시작하는 단어만 사용가능합니다.'); return;}
            }
            this.socket.emit('searchWord', {word:this.inputWord, roomId:this.roomInfo.roomId});
            this.myTurn++;  
        },
        systemMsg(msg){
            this.chatList.push({id:'SYSTEM', nickName:'SYSTEM', msg:msg}); 
            this.scroll(); 
        },
        endGame(){
            this.game = false;
            this.round = 0;
            this.limitTime = 0;
            this.startWord = '';
            this.inputWord = '';
            this.endWord = '가';
            this.phoneticRule = null;
            this.turn = 0;
            this.myTurn = 0;
            this.gameEnd = false;
            this.page = -1;
            this.wordList = [];
            this.wordViewList = [];
            this.chatList = [];
            this.socket.emit('endwordEndGame', this.roomInfo.roomId);
        }
    }
}
</script>

<style scoped>  
    #endword{
        margin: 0 auto;
        width: 70%;
        height: 70%;
        background-color: white;
        border-radius: 10px;
        position: relative;
    }
    
    .result-popup{      
        position: absolute;    
        width: 100%;
        height: 100%;  
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

    .result-popup > .content{
        width: 250px;   
        height: 300px;
        background-color: #ffffff;
        border-radius: 5px;
        display: grid;
        grid-template-rows: 5fr 1fr;
        overflow: auto;
        box-shadow: 3px 3px 3px gray;
        border: 1px solid #cad4d8;
    }

    .result-popup > .content > .result-list{
        margin-top: 10px;
        text-align: center;
        overflow-y: scroll; 
        scrollbar-width: none;
    }
    .result-popup > .content > .result-list::-webkit-scrollbar {
        display: none;
    }

    .result-popup > .content > .result-list > .result{
        width: 90%;
        margin: 0 auto;
        margin-bottom: 10px;
        border-radius: 5px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        background-color: #e0e0e0;
    }

    .result-popup > .content > .button-menu{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title{
        background-color: #bdbdbd;/* 00bcee */
        text-align: center;
        box-shadow: 0px 3px 5px gray;
        margin-bottom: 5px;
        height: 22px;
    }   

    .title.info{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    
    select{
        width: 20%;
    }

    .wait-room{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 2fr 1fr;
    }

    .wait-room > .left{
        display: grid;
        grid-template-rows: 27px 1fr 27px 5fr;
    }

    .wait-room > .left > .room-menu{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .wait-room > .left > .user-list{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .wait-room > .left > .user-list > .user-content{
        width: 92%;
        height: 92%;  
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: 15px;
    }

    .wait-room > .left > .user-list > .user-content > .user{
        background-color: #d6d6d6;
        border-radius: 5px;
        display: grid;
        grid-template-rows: 4fr 1fr;
        text-align: center;
        align-items: center;
        cursor: pointer;
    }

    .wait-room > .left > .user-list > .user-content > .user.my{
        background-color: #e2bc3d;
    }

    .wait-room > .left > .user-list > .user-content > .user > i{    
        font-size: 70px;
    }

    .wait-room > .right{
        border-radius: 0px 0px 0px 5px;
        overflow: auto;
    }

    .wait-room > .right > .public-chat{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 27px 10fr 1fr;
    }

    .wait-room > .right > .public-chat > .chating{
        overflow-y: scroll;
        scrollbar-width: none;
    }
    .wait-room > .right > .public-chat > .chating::-webkit-scrollbar {
        display: none;
    }

    .wait-room > .right > .public-chat > .chating > .chat{
        background-color: #cccccc;
        margin-bottom: 4px;
        box-shadow: 0px 2px 3px gray;
        word-break:break-all;
    }

    .wait-room > .right > .public-chat > .chating > .chat.my{
        background-color: #e2bc3d;
    }

    .wait-room > .right > .public-chat > .send{
        display: grid;
        grid-template-columns: 9fr 1fr;
    }
/*-------------------------------------------------------------------------------------------------------- */
    .play-room{
        position: absolute;
        height: 100%;   
        width: 100%;
        display: grid;
        grid-template-rows: 27px 3fr 2fr 2fr 5fr;
    } 

    .play-room > .guide{
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

    .play-room > .guide > .content{
        width: 50%;
        height: 80%;
        text-align: center;
    }

    .play-room > .guide > .content > .word-time{
        background-color: #e0e0e0;
        border-radius: 5px;
    }
    
    .play-room > .guide > .content > .word-time > .time{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .play-room > .guide > .content > .word-time > .time > .num{
        margin-left: 1%;
    }
    
    #input-word{
        position: fixed;
        margin-top: 0.5%;
        width: 35%;
    }

    #input-word{
        position: fixed;
        margin-top: 0.5%;
        width: 35%;
    }

    .play-room > .word-list{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .play-room > .word-list > .words{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 5px;
        width: 98%;
        height: 80%;
    }

    .play-room > .word-list > .words > .word{
        background-color: #e0e0e0;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 1fr 1fr;
        text-align: center;
        align-items: center;
    }

    .play-room > .user-list{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .play-room > .user-list > .content{
        width: 98%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-column-gap: 5px;
        align-items: center;
    }

    .play-room > .user-list > .content > .user{
        background-color: #e0e0e0;
        border-radius: 5px;
        width: 100%;
        height: 80%;
        display: grid;
        grid-template-rows: 1fr 1fr;
        align-items: center;
        text-align: center;
    }

    .play-room > .user-list > .content > .user.now{
        box-shadow: 3px 3px 1px grey;
        background-color: #e2bc3d;
    }
    
    .play-room > .user-list > .content > .user > .user-info{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .play-room > .user-list > .content > .user > .user-info > i{
        font-size: 25px;
    }

    .play-room > .public-chat{
        display: grid;
        grid-template-rows: 27px 2fr 0.5fr;
        overflow: auto;
    }

    .play-room > .public-chat > .chating{
        overflow-y: scroll;
        scrollbar-width: none;
    }
    .play-room > .public-chat > .chating::-webkit-scrollbar {
        display: none;
    }

    .play-room > .public-chat > .chating > .chat{
        background-color: #cccccc;
        margin-bottom: 4px;
        box-shadow: 0px 2px 3px gray;
        word-break:break-all;
    }

    .play-room > .public-chat > .chating > .chat.my{
        background-color: #e2bc3d;
    }

    .play-room > .public-chat > .send{
        display: grid;
        grid-template-columns: 1fr 6fr 1fr;
    }

    .tr-enter-active, .tr-leave-active{
        transition: opacity 0.5s;
    }

    .tr-enter, .tr-leave-to{
        opacity: 0;
    }
</style>
