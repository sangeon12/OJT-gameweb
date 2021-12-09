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
        </select>
        <button type="button" class="btn btn-warning" @click="createRoom">만들기</button>
        <button type="button" class="btn btn-info" @click="createRoomView = false">취소</button>
      </div>
    </transition>

    <transition name="tr">
      <div class="searchRoom" v-if="searchRoomView">
        <h4>방찾기</h4>
        <input type="text" class="form-control" v-model="searchRoomId" placeholder="방번호" aria-label="roomname" aria-describedby="basic-addon1">
        <button type="button" class="btn btn-warning" @click="searchRoom">들어가기</button>
        <button type="button" class="btn btn-info" @click="searchRoomView = false">취소</button>
      </div>
    </transition>

    <div class="myContainer">
      <div class="left">
        <div class="title" style="border-radius: 10px 0px 0px 0px;">방 리스트</div>
        <div class="roomMenu">
          <button type="button" class="btn btn-secondary" @click="createRoomView = true">방만들기</button>
          <button type="button" class="btn btn-secondary" @click="searchRoomView = true">방찾기</button>
          <button type="button" class="btn btn-secondary" @click="logout">로그아웃</button>
        </div>
        <div class="roomList">
          <div class="rooms">
            
            <div class="room" v-for="room in roomList" :key="room" @click="enterRoom(room.roomId)">
              <div class="roomName">{{room.roomName}}({{room.roomId}}) 
                <i class="fas fa-lock" v-if="room.roomPassword !== ''"></i><i class="fas fa-lock-open" v-else></i>
              </div>
              <div class="selectGame">{{room.selectGame}}</div>
              <div class="inUser">{{room.inUser}}/{{room.max}}</div>
            </div>

          </div>
        </div>
      </div>

      <div class="right">
        <div class="title point" style="border-radius: 0px 10px 0px 0px;" @click="userListView"><b>유저</b></div>

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
    this.socket.on('kickResult', ()=>{this.$router.go();})
    this.socket.on('roomList', data=>{this.roomList = data});
  },
  data(){
    return{
      userView:false,
      socket:this.$socket,
      userList:[],
      chatList:[],
      roomList:[],
      msgInput:'',
      createRoomView:false,
      createRoomName:'',
      createRoomPassword:'',
      createRoomSelectGame:'',
      searchRoomView:false,
      searchRoomId:''
    }
  },
  methods:{
    userListView(){
      this.userView = !this.userView;
      if(this.userView){
        this.$j(".userList").stop().slideDown(250);
      }else{
        this.$j(".userList").stop().slideUp(250);
      }
    },
    sendMsg(){
      this.socket.emit('sendMsg', this.msgInput);
      this.msgInput = '';
    },
    scroll() {
      const msgBox = document.querySelector(".chating");
        let scrollInterval = setInterval(() => {  
        msgBox.scrollTop = msgBox.scrollHeight;
        clearInterval(scrollInterval);
      }, 10);
    },
    kick(id){
      if(this.socket.id === id) return;
      if(this.userList.findIndex(x => x.id === this.socket.id && x.admin) >= 0){
        if(confirm("추방 하시겠습니까?") == true){
          this.socket.emit('kick', id);
        }else{
          return;
        }
      }
    },
    logout(){
      if(confirm("로그아웃 하시겠습니까?") == true){
        this.socket.emit('logout');
        this.$router.go();
      }else{
        return;
      }
    },
    createRoom(){
      const selectGame = document.querySelector("#selectGame").value;
      if(this.createRoomName === "" || selectGame === "" || selectGame === "방종류"){
        alert("방 이름 또는 게임이 비어있습니다.");
        return;   
      }
      if(this.createRoomName.length > 5){
        alert("방 이름이 너무 깁니다!! 5글자 이하로 작성해주세요.");
        return;
      }
      if(selectGame === 'chating') this.$router.options.routes[2].meta.inRoom = true;
      else if(selectGame === 'endword') this.$router.options.routes[3].meta.inRoom = true;
      this.socket.emit(selectGame, {roomName:this.createRoomName, roomPassword:this.createRoomPassword, selectGame:selectGame});
      this.createRoomName = '';
      this.createRoomPassword = '';
      location.replace("/#/"+selectGame);
    },
    enterRoom(roomId){
      let roomInfo = this.roomList.find(x => x.roomId === roomId);
      if(roomInfo.game){
        alert('이미 게임이 진행중입니다.');
        return;
      }
      if(roomInfo.inUser === roomInfo.max){
          alert('방에 빈자리가 없습니다.');
          return;
      }
      if(roomInfo.roomPassword !== ""){
        let userInfo = this.userList.find(x => x.id === this.socket.id);
        if(!userInfo.admin){
          let passwordAlert = prompt( '비밀번호를 입력해주세요.', ''); 
          if(passwordAlert !== roomInfo.roomPassword){
            alert('비밀번호가 틀렸습니다.');
            return; 
          }
        }
      }
      if(confirm("방에들어가시겠습니까?") == true){
          if(roomInfo.selectGame === 'chating') this.$router.options.routes[2].meta.inRoom = true;
          else if(roomInfo.selectGame === 'endword') this.$router.options.routes[3].meta.inRoom = true;
          this.socket.emit(roomInfo.selectGame+'In', roomInfo.roomId);
          location.replace("/#/"+roomInfo.selectGame);
      }else{
            return;
      }
    },
    searchRoom(){
      const searchRoomId = parseInt(this.searchRoomId);
      const roomInfo = this.roomList.find(x => x.roomId === searchRoomId);
      if(roomInfo === undefined){
        alert('방이 존재하지않습니다.');
        return;
      }
      this.enterRoom(searchRoomId);
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
    width: 270px;
    height: 285px;
    z-index: 10;
    background-color: white;
    text-align: center;
    border-radius: 5px;
    box-shadow: 3px 3px 3px gray;
    border: 1px solid #cad4d8;
  }

  .createRoom > h4{
    margin-top: 10%;
    margin-bottom: 5%;
  }

  .createRoom > input, select{
    margin: 0 auto;
    width: 80%;
    margin-bottom: 5%;
  }

  .searchRoom{
    position: absolute;
    width: 270px;
    height: 170px;
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

  .left{
    display: grid;
    grid-template-rows: 27px 1fr 10fr;
    overflow: auto;
  }

  .roomMenu{
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #dbdbdb;
  }

  .roomList{
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .roomList::-webkit-scrollbar {
    display: none;
  }

  .rooms{
    margin-top: 5px;
    width: 98%;
    height: 98%; 
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  }

  .room{
    float: left;
    margin-bottom: 5px;
    margin-left: 5px;
    background-color: #bdbdbd;
    border-radius: 5px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    text-align: center;
    cursor: pointer;
  }

  .roomName{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .right{
    display: grid;
    grid-template-rows: 27px 1fr;
    height: 100%;
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
    margin-bottom: 4px; 
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
    margin-bottom: 4px;
    box-shadow: 0px 2px 3px gray;
    word-break:break-all;
  }

  .chat.my{
    background-color: #e2bc3d;
  }

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
