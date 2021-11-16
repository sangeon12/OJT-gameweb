<template>
    <div id="endword">

        <div class="wait-room" v-if="!game">
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
                        <button type="button" class="btn btn-secondary" v-if="roomInfo.host === socket.id">시작하기</button>
                        <button type="button" class="btn btn-secondary" @click="ready" v-else>준비하기</button>
                        <button type="button" class="btn btn-secondary" @click="outRoom">나가기</button>
                    </div>
                </div>
                <div class="title">유저</div>
                <div class="user-list">
                    <div class="user-content">
                        <div class="user" v-for="user in  userList" :key="user" @click="kick(user.id)">
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

        <div class="play-room" v-else>
            <div class="info">방이름(0) 1라운드</div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'EndWord',
    mounted(){
        this.socket.on('endword', data => {this.userList = data});
        this.socket.on('roomInfo', data => {this.roomInfo = data});
        this.socket.on('endwordAwesome', data =>{this.chatList.push(data); this.scroll();});
        this.socket.once('enwordKickResult', ()=>{ location.href = "/#/main"; this.socket.emit('leaveRoom', this.roomInfo.roomId)});
        if (document.readyState == 'loading') {location.href = '/#/';}
    },
    data(){
        return{
            socket:this.$socket,
            roomInfo:[],
            userList:[],
            msgInput:'',
            chatList:[],
            game:false
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
</style>