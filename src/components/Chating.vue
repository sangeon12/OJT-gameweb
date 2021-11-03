<template>
    <div id="chating">
        <div class="right">
            <div class="title">방정보</div>
            <div class="roomInfo">
                <div class="roomName">{{roomInfo.roomName}}</div>
                <div class="roomId">{{roomInfo.roomId}}</div>
            </div>
            <div class="title">유저</div>
            <div class="userList">
                <div class="user" v-for="user in userList" :key="user" :class="{my:user.id === socket.id}">{{user.nickName}}</div>
            </div>
            <div class="menu">
                <div class="out">나가기</div>
            </div>
        </div>

        <div class="left">
            <div class="publicChat">
                <div class="title">채팅</div>
                <div class="chating">
                <div class="chat" v-for="chat in chatList" :key="chat" :class="{my:chat.id === socket.id}">{{chat.nickName}} : {{chat.msg}}<i class="fa-solid fa-m"></i></div>
              </div>
              <div class="send">
                <input type="text" class="form-control" placeholder="message" aria-label="message" aria-describedby="basic-addon1" v-model="msgInput" @keydown.enter="sendMsg">
                <button type="button" class="btn btn-outline-dark" @click="sendMsg">>></button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Chating',
    mounted(){
        this.socket.on('userList', data => {this.userList = data});
        this.socket.on('roomList', data => {this.roomInfo = data});
        this.socket.on('chatingAwesome', data =>{this.chatList.push(data); this.scroll();});
    },
    data(){
        return{
            socket:this.$socket,
            roomInfo:[],
            userList:[],
            msgInput:'',
            chatList:[]
        }
    },
    methods:{
        sendMsg(){
            if(this.msgInput === "") return;
            this.socket.emit('chatingMsg', {msg:this.msgInput, roomId:this.roomInfo.roomId});
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
            if(confirm("정말 나가시겠습니까?") == ture){
                this.socket.emit('roomOut');
                location.href = "/#/main";
            }else{
                return;
            }
        }
    }
}
</script>

<style scoped>
    #chating{
        margin: 0 auto;
        width: 70%;
        height: 70%;
        background-color: white;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 1fr 5fr;
        overflow: auto;
    }

    .title{
        background-color: #bdbdbd;
        text-align: center;
        box-shadow: 0px 3px 5px gray;
        margin-bottom: 5px;
        height: 22px;
    }

    .right{
        display: grid;
        grid-template-rows: 27px 1fr 27px 6fr 38px;
        overflow: auto;
    }

    .roomInfo{
        display: grid;
        grid-template-rows: 1fr 1fr;
        text-align: center;
    }

    .userList{
        overflow-y: scroll;
        scrollbar-width: none;
        text-align: center;
    }   
    .userList::-webkit-scrollbar {
        display: none;
    }

    .user{
        width: 90%;
        margin: 0 auto;
        background-color: #e0e0e0;
        margin-bottom: 5px;
        box-shadow: 0px 3px 5px gray;
    }

    .user.my{
        background-color: #e2bc3d;
    }

    .out{
        background-color: #555555;
        color: white;
        height: 38px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .left{
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .publicChat{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 27px 10fr 1fr;
    }

    .chating{
        overflow-y: scroll;
        scrollbar-width: none;
    }
    .chating::-webkit-scrollbar {
        display: none;
    }

    .chat{
        background-color: #cccccc;
        margin-bottom: 8px;
        box-shadow: 0px 2px 3px gray;
    }

    .chat.my{
        background-color: #e2bc3d;
    }

    .send{
        display: grid;
        grid-template-columns: 9fr 1fr;
    }
</style>