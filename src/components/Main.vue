<template>
  <div id="main">

    <div class="right">
      <div class="title" style="border-radius: 10px 0px 0px 0px;">방 리스트</div>
      <div class="roomMenu">
        <button type="button" class="btn btn-success">방만들기</button>
        <button type="button" class="btn btn-danger">방찾기</button>
      </div>
      <div class="roomList">
        <div class="room">방</div>
        <div class="room">방</div>
        <div class="room">방</div>
        <div class="room">방</div>
      </div>
    </div>

    <div class="left">
      <div class="title point" style="border-radius: 0px 10px 0px 0px;" @click="userListView">유저 리스트</div>

      <div class="content">
        <div class="userList">
          <div class="user" v-for="user in userList" :key="user" :class="{my:user.id === socket.id}">{{user.nickName}}</div>
        </div>

        <div class="publicChat">
            <div class="title">채팅</div>
            <div class="chating">
              <div class="chat" v-for="chat in chatList" :key="chat" :class="{my:chat.id === socket.id}">{{chat.nickName}} : {{chat.msg}}</div>
            </div>
            <div class="send">
              <input type="text" class="form-control" placeholder="message" aria-label="message" aria-describedby="basic-addon1" v-model="msgInput">
              <button type="button" class="btn btn-outline-dark" @click="sendMsg" v-on:keyup.enter="sendMsg">>></button>
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
    this.socket.on('userLogin', data=>{this.userList = data;});
    this.$axios.post('/getNickName', {id:this.socket.id}).then(res =>{this.nickName = res.data;});
    this.socket.on('awesome', data=>{this.chatList.push(data);});
  },
  data(){
    return{
      userView:false,
      socket:this.$socket,
      nickName:'',
      userList:[],
      chatList:[],
      msgInput:''
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
    justify-content: center;
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
  }

  .left{
    display: grid;
    grid-template-rows: 27px 1fr;
    overflow: auto;
  }

  .content{
    position: relative;
    overflow: auto;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .content::-webkit-scrollbar {
    display: none;
  }

  .publicChat{
    width: 100%;
    position: absolute;
    height: 100%;
  }

  .userList{
    position: absolute;
    text-align: center;
    border-radius: 5px;
    background-color: #bdbdbd;
    margin-bottom: 5px;
    box-shadow: 0px 3px 5px gray;
    z-index: 10;
    width: 100%;
    height: 100%;
  }

  .user{
    background-color: #e0e0e0;
    margin-bottom: 5px;
    box-shadow: 0px 3px 5px gray;
  }

  .user.my{
    background-color: #adadad;
  }

  .publicChat{
    display: grid;
    grid-template-rows: 27px 11fr 1fr;
  }

  .chat{
    background-color: #cccccc;
    margin-bottom: 10px;
    box-shadow: 0px 2px 3px gray;
  }

  .chat.my{
    background-color: #e2bc3d;
  }

  .send{
    display: grid;
    grid-template-columns: 6fr 1fr;
  }
</style>
