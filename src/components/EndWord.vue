<template>
    <div id="endword">

        <div class="waitRoom">
            <div class="right">
                <div class="title" style="border-radius: 10px 0px 0px 0px;">방메뉴</div>
                <div class="waitMenu">
                    <div class="roomInfo">방이름(0)</div>
                    <div class="menu">
                        <button type="button" class="btn btn-secondary">시작하기</button>
                        <button type="button" class="btn btn-secondary">나가기</button>
                    </div>
                </div>
                <div class="title">유저</div>
                <div class="userList">
                    <div class="user">임상언</div><div class="user">임상언</div><div class="user">임상언</div><div class="user">임상언</div>
                    <div class="user">임상언</div><div class="user">임상언</div><div class="user">임상언</div><div class="user">임상언</div>
                </div>
            </div>

            <div class="left">
                <div class="publicChat">
                    <div class="title" style="border-radius: 0px 10px 0px 0px;">채팅</div>
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

    </div>
</template>

<script>
export default {
    name: 'EndWord',
    mounted(){
        this.socket.on('endword', data => {this.userList = data});
        this.socket.on('roomInfo', data => {this.roomInfo = data});
        this.socket.on('endwordAwesome', data =>{this.chatList.push(data); this.scroll();});
        this.socket.on('kickChatingResult', ()=>{location.href = "/#/main"; this.socket.emit('leaveRoom', this.roomInfo.roomId)});
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
                    this.socket.emit('kickChating', id);
                }else{
                    return;
                }
            }
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
        display: grid;
        grid-template-columns: 2fr 1fr;
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
        grid-template-rows: 27px 1fr 27px 4fr;
        overflow: auto;
    }

    .waitMenu{
        background-color: #dbdbdb;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
    }

    .userList{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: 10px;
        height: 100%;
    }

    .user{
        background-color: #bdbdbd;
        border-radius: 5px;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        cursor: pointer;
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
        word-break:break-all;
    }

    .chat.my{
        background-color: #e2bc3d;
    }

    .send{
        display: grid;
        grid-template-columns: 9fr 1fr;
    }
</style>