<template>
    <div id="endword">

        <transition name="tr" mode="out-in">
            <div class="wait-room" v-if="!game" key="wait-room">
                <div class="left">
                    <div class="title" style="border-radius : 10px 0px 0px 0px">방메뉴</div>
                    <div class="room-menu">
                        <div class="room-info">{{roomInfo.roomName}}({{roomInfo.roomId}})</div>
                        <select class="form-select" aria-label="Default select example" id="round">
                            <option selected>라운드</option>
                            <option value="1">1라운드</option>
                            <option value="2">2라운드</option>
                            <option value="3">3라운드</option>
                        </select>
                        <select class="form-select" aria-label="Default select example" id="round">
                            <option selected>제한시간</option>
                            <option value="1">30초</option>
                            <option value="2">45초</option>
                            <option value="3">90초</option>
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
                    <h6>방이름(0)</h6>
                    <h6>끝말잇기</h6>
                    <h6>참여자2/8</h6>
                    <h6>1라운드</h6>
                    <h6>45초</h6>
                </div>

                <div class="guide">
                    <div class="content">
                        <h6>드라이버</h6>
                        <div class="word-time">
                            <div class="end-word">드</div>
                            <div class="time">
                                <progress max="10" value="8"></progress>
                                <div class="num">8</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="word-list">
                    <div class="word">
                        <div class="text">드라이버</div>
                        <div class="meaning">나사를 조이는 도구</div>
                    </div>
                    <div class="word">
                        <div class="text">버드</div>
                        <div class="meaning">새</div>
                    </div>
                </div>

                <div class="user-list">
                    <div class="content">
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
                        </div>
                        <div class="user my now">
                            <i class="fas fa-user"></i>
                            <div class="name">임상언</div>
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
        this.socket.on('endwordGameStart', ()=>{this.game = !this.gamel;});
        if (document.readyState == 'loading') {location.href = '/#/';}
    },
    data(){
        return{
            socket:this.$socket,
            roomInfo:[],
            userList:[],
            msgInput:'',
            chatList:[],
            game:false,
            wordList:[]
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
            this.chatList = [];
            this.socket.emit('endwordGameStart');
        },
        stopGame(){
            this.chatList = [];
            this.game = false;
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

    .play-room > .word-list{
        display: flex;
        align-items: center;
    }

    .play-room > .word-list > .word{
        background-color: #e0e0e0;
        border-radius: 5px;
        margin-left: 10px;
        width: 20%;
        height: 80%;
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
        grid-template-rows: 2fr 1fr;
        align-items: center;
        text-align: center;
    }

    .play-room > .user-list > .content > .user.my.now{
        box-shadow: 3px 3px 1px grey;
        background-color: #9ad492;
    }

    .play-room > .user-list > .content > .user > i{
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