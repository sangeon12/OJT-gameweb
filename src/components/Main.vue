<template>
  <div id="main">

    <transition name="tr">
      <div class="createRoom" v-if="createRoomView">
        <h4>방만들기</h4>
        <input type="text" class="form-control" v-model="createRoomName" placeholder="방이름" aria-label="roomName" aria-describedby="basic-addon1">
        <input type="text" class="form-control" v-model="createRoomPassword" placeholder="비밀번호" aria-label="roomPassword" aria-describedby="basic-addon1">
        <select class="form-select" aria-label="roomSelect" id="selectGame">
          <option selected>방종류</option>
          <option value="chating">채팅방</option>
          <option value="endword">끝말잇기</option>
          <option value="mafia">마피아</option>
        </select>
        <button type="button" class="btn btn-warning" @click="createRoom">만들기</button>
        <button type="button" class="btn btn-info" @click="createRoomView = false">취소</button>
      </div>
    </transition>

    <transition name="tr">
      <div class="searchRoom" v-if="searchRoomView">
        <h4>방찾기</h4>
        <input type="text" class="form-control" placeholder="방번호" aria-label="roomname" aria-describedby="basic-addon1">
        <button type="button" class="btn btn-warning">들어가기</button>
        <button type="button" class="btn btn-info" @click="searchRoomView = false">취소</button>
      </div>
    </transition>

    <div class="myContainer">
      <div class="right">
        <div class="title" style="border-radius: 10px 0px 0px 0px;">방 리스트</div>
        <div class="roomMenu">
          <button type="button" class="btn btn-secondary" @click="createRoomView = true">방만들기</button>
          <button type="button" class="btn btn-secondary" @click="searchRoomView = true">방찾기</button>
          <button type="button" class="btn btn-secondary" @click="logout">로그아웃</button>
        </div>
        <div class="roomList">
          <div class="room" v-for="room in roomList" :key="room" @click="enterRoom(room.roomId)">
            <div class="roomName">{{room.roomName}}/{{room.roomId}}</div>
            <div class="selectGame">{{room.selectGame}}</div>
            <div class="inUser">{{room.inUser}}/{{room.max}}</div>
          </div>
        </div>
      </div>

      <div class="left">
        <div class="title point" style="border-radius: 0px 10px 0px 0px;" @click="userListView">유저</div>

        <div class="content">
          <div class="userList" style="border-radius: 0px 0px 10px 0px;">
            <div class="user" v-for="user in userList" :key="user" :class="{my:user.id === socket.id}" @click="kick(user.id)">{{user.nickName}}</div>
          </div>

          <div class="publicChat">
              <div class="title">채팅</div>
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

  </div>
</template>

<script>
export default {
  name: 'Main',
  mounted(){
    this.$j(".userList").hide();
    this.socket.on('userList', data=>{this.userList = data;});
    this.socket.on('roomList', data=>{this.roomList = data});
    this.socket.on('awesome', data=>{this.chatList.push(data); this.scroll();});
    this.socket.on('kickResult', data=>{if(this.socket.id === data){this.systemList = []; location.href = "/#/"; this.$router.go();}})
    this.socket.on('roomList', data=>{this.roomList = data});
  },
  data(){
    return{
      userView:false,
      socket:this.$socket,
      userList:[],
      chatList:[],
      msgInput:'',
      createRoomView:false,
      searchRoomView:false,
      createRoomName:'',
      createRoomPassword:'',
      createRoomSelectGame:'',
      roomIn:false,
      roomList:[]
    }
  },
  methods:{
    userListView(){
      this.userView = !this.userView;
      if(this.userView){
        this.$j(".userList").stop().slideDown();
      }else{
        this.$j(".userList").stop().slideUp();
      }
    },
    sendMsg(){
      this.socket.emit('sendMsg', this.msgInput);
      this.msgInput = '';
    },
    scroll() {
      if(this.roomIn) return;
      const msgBox = document.querySelector(".chating");
        let scrollInterval = setInterval(() => {  
        msgBox.scrollTop = msgBox.scrollHeight;
        clearInterval(scrollInterval);
      }, 10);
    },
    kick(id){
      if(this.socket.id === id) return;
      if(this.userList.findIndex(x => x.id === this.socket.id && x.admin) >= 0){
        if(confirm("강퇴 하시겠습니까?") == true){
          this.socket.emit('kick', id);
        }else{
          return;
        }
      }
    },
    logout(){
      if(confirm("로그아웃 하시겠습니까?") == true){
        this.socket.emit('logout', this.socket.id);
        location.href = "/#/"; 
        this.$router.go();
      }else{
        return;
      }
    },
    createRoom(){
      const selectGame = document.querySelector("#selectGame").value;
      if(this.createRoomName === "" || selectGame === ""){
        alert("방 이름 또는 게임을 선택해주세요.");
        return;   
      }
      this.socket.emit(selectGame, {roomName:this.createRoomName, roomPassword:this.createRoomPassword, selectGame:selectGame});
      this.roomIn = true;
      this.createRoomName = '';
      this.createRoomPassword = '';
      location.href = "/#/"+selectGame;
    },
    enterRoom(roomId){
      let room = this.roomList.find(x => x.roomId === roomId);
      if(room.roomPassword !== ""){
        alert('비밀번호를 입력해주세요.');
        return;
      }else{
        if(confirm("방에들어가시겠습니까?") == true){
          this.socket.emit(room.selectGame+'In', room.roomId);
          this.roomIn = true;
          location.href = "/#/"+room.selectGame;
        }else{
          return;
        }
      }
    }
  }
}
</script>

<style scoped>
  #main{
    margin: 0 auto;
    width: 70%;
    height: 70%;
    background-color: white;
    border-radius: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .createRoom{
    position: absolute;
    width: 35%;
    height: 60%;
    z-index: 10;
    background-color: white;
    text-align: center;
    border-radius: 5px;
    box-shadow: 3px 3px 3px gray;
    border: 1px solid #cad4d8;
  }

  .createRoom > h4{
    margin-top: 5%;
    margin-bottom: 5%;
  }

  .createRoom > input, select{
    margin: 0 auto;
    width: 80%;
    margin-bottom: 5%;
  }

  .searchRoom{
    position: absolute;
    width: 35%;
    height: 40%;
    z-index: 10;
    background-color: white;
    text-align: center;
    border-radius: 5px;
    box-shadow: 3px 3px 3px gray;
    border: 1px solid #cad4d8;
  }

  .searchRoom > h4{
    margin-top: 5%;
    margin-bottom: 6%;
  }

  .searchRoom > input{
    margin: 0 auto;
    width: 80%;
    margin-bottom: 5%;
  }

  .myContainer{
    position: absolute;
    width: 100%;
    height: 100%;
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

  .title.point{
    cursor: pointer
  }

  .right{
    display: grid;
    grid-template-rows: 27px 1fr 10fr;
  }

  .roomMenu{
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #dbdbdb;
  }

  .roomList{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 5px;
    margin-top: 5px;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .roomList::-webkit-scrollbar {
    display: none;
  }

  .room{
    background-color: #bdbdbd;
    border-radius: 5px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    cursor: pointer;
  }

  .left{
    display: grid;
    grid-template-rows: 27px 1fr;
  }

  .content{
    position: relative;
    overflow: auto;
  }

  .userList{
    position: absolute;
    text-align: center;
    border-bottom-right-radius: 5px;
    background-color: #bdbdbd;
    margin-bottom: 5px; 
    box-shadow: 0px 3px 5px gray;
    z-index: 10;
    width: 100%;
    height: 100%;
    cursor: pointer;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .userList::-webkit-scrollbar {
    display: none;
  }

  .user{
    background-color: #e0e0e0;
    margin-bottom: 5px;
    box-shadow: 0px 3px 5px gray;
  }

  .user.my{
    background-color: #e2bc3d;
  }

  .publicChat{
    width: 100%;
    position: absolute;
    height: 100%;
    display: grid;
    grid-template-rows: 27px 10fr 1fr;
    overflow: auto; 
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

  /* .systemMsg{
    background-color: #95bd92;
    box-shadow: 0px 2px 3px gray;
    margin-bottom: 8px;
  } */

  .send{
    display: grid;
    grid-template-columns: 6fr 1fr;
  }

  .tr-enter-active, .tr-leave-active{
    transition: opacity 0.5s;
  }

  .tr-enter, .tr-leave-to{
      opacity: 0;
  }
</style>
