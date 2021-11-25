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
                            <option value="2">2초</option>
                            <option value="5">5초</option>
                            <option value="10">10초</option>
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
                        <h6>드라이버</h6>
                        <div class="word-time">
                            <div class="end-word">{{endWord}}</div>
                            <div class="time">
                                <progress :max="limitTime" :value="time"></progress>
                                <div class="num">{{time}}</div>
                            </div>
                            <input type="text" id="input-word" v-if="userList[page].id === socket.id" v-model="inputWord" @keydown.enter="input" class="form-control" placeholder="단어를 입력해주세요." aria-label="Username" aria-describedby="basic-addon1">
                        </div>
                    </div>
                </div>

                <div class="word-list">
                    <div class="words">
                        <div class="word" v-for="word in wordList" :key="word">
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
                        <button type="button" class="btn btn-outline-dark" @click="stopGame">나가기</button>
                        <input type="text" class="form-control" placeholder="message" aria-label="message" aria-describedby="basic-addon1" v-model="msgInput" @keydown.enter="sendMsg">
                        <button type="button" class="btn btn-outline-dark" @click="sendMsg">>></button>
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
        this.socket.on('endwordList', data => {this.userList = data});
        this.socket.on('roomInfo', data => {this.roomInfo = data});
        this.socket.on('endwordAwesome', data =>{this.chatList.push(data); this.scroll();});
        this.socket.once('enwordKickResult', ()=>{ location.href = "/#/main"; this.socket.emit('leaveRoom', this.roomInfo.roomId)});
        this.socket.on('endwordGameStart', data=>{this.game = !this.game; this.chatList = []; this.round = data.round; this.limitTime = data.limitTime; this.cycle();});
        this.socket.on('resultWord', data=>{
            if(data[0].content === null){this.systemMsg('없는 단어입니다.'); return;}
            if(this.wordList.length > 4) this.wordList.splice(0,1);
            if(data[0].name.length <= 10 && data[0].content.length > 11) this.wordList.push({name:data[0].name, content:data[0].content.substring(0, 11)+'...'});
            else if(data[0].name.length > 10 && data[0].content.length <= 12) this.wordList.push({name:data[0].name.substring(0, 9)+'...', content:data[0].content});
            else if(data[0].name.length > 10 && data[0].content.length > 12) this.wordList.push({name:data[0].name.substring(0, 9)+'...', content:data[0].content.substring(0, 11)+'...'});
            else if(data[0].name.length <= 10 && data[0].content.length <= 12) this.wordList.push(data[0]);
            this.socket.emit('endwordScore', {roomId:this.roomInfo.roomId, le:data[0].name.length, time:this.time});
            this.endWord = data[0].name.substr(data[0].name.length - 1, 1);
            this.inputWord = '';
            this.time = 0;
        });
        if(document.readyState == 'loading') location.href = '/#/';
    },  
    data(){
        return{
            socket:this.$socket,
            roomInfo:[],
            userList:[],
            msgInput:'',
            chatList:[],
            game:false,
            wordList:[],
            page:0,
            round:0,
            limitTime:0, //사용자가 정한 제한시간
            time:0, //실제 화면에서 보여지는 제한시간
            inputWord:'',
            endWord:'드'
        }
    },
    methods:{
        sendMsg(){
            if(this.msgInput === "") return;
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
                this.socket.emit('roomOut');
                location.href = "/#/main";
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
            this.socket.emit('endwordReady');
        },
        gameStart(){
            if(this.userList.length < 1){
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
            this.socket.emit('endwordGameStart', {round:this.round, limitTime:this.limitTime});
        },
        stopGame(){
            this.chatList = [];
            this.game = false;
        },
        cycle(){
            this.time = this.limitTime;
            let pageCycle = setInterval(()=>{
                if(this.time === 0){
                    this.time = this.limitTime;
                    this.time++;
                    this.page++;
                    if(this.page === this.userList.length) this.page = 0;
                }
                this.time--;
                this.socket.emit('cycle', {time:this.time, roomId:this.roomInfo.roomId});
            }, 1000);
        },
        input(){
            if(this.userList[this.page].id !== this.socket.id) return;
            if(this.wordList.findIndex(x => x.name === this.inputWord) >= 0){this.systemMsg('중복되는 단어입니다.'); return;}
            if(this.inputWord.length <= 1){this.systemMsg('2자리 이상의 단어만 사용 가능합니다.'); return;}
            if(this.inputWord.indexOf(this.endWord) !== 0){this.systemMsg('('+this.endWord+')로 시작하는 단어만 사용가능합니다.'); return;}
            if(this.time === 0) return;
            this.socket.emit('searchWord', {word:this.inputWord, roomId:this.roomInfo.roomId});
        },
        systemMsg(msg){
            this.chatList.push({id:'SYSTEM', nickName:'SYSTEM', msg:msg}); 
            this.scroll(); 
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
        height: 100%;
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