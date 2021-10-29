<template>
  <div id="login">
      <div class="title">
          <h1>Welcome</h1>
        <h2>Please login</h2>
      </div>
    <input v-model="nickName" type="text" class="form-control" placeholder="Username" aria-label="Nickname" aria-describedby="basic-addon1">
    <button type="button" class="btn btn-secondary" @click="login">login</button>      
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
      return{
          nickName:''
      }
  },
  methods:{
      login(){
          this.$axios.post('/checkNickname', {nickName:this.nickName}).then(res =>{
              console.log(res.data);
              switch(res.data){
                    case 0:
                        alert('닉네임은 공백을 포함할 수 없습니다.');
                        break;
                    case 1:
                        alert('중복되는 닉네임 입니다.');
                        break;
                    case 2:
                        alert('사용할 수 없는 닉네임입니다.');
                        break;
                    case 3:
                        alert('이미 관리자 접속중입니다.');
                        break;
                    case 4:
                        this.$socket.emit('login', this.nickName);
                        location.href = "/#/main"
                        break;
              }
          });
      }
  }
}
</script>

<style scoped>
    #login{
        margin: 0 auto;
        margin-top: 166.5px;
        width:  21%;
        height: 45%;
        border-radius: 10px;
        background-color: white;
        text-align: center;
        overflow: auto;
    }

    input{
        width: 80%;
        margin: 0 auto;
        margin-bottom: 5%;
    }

    .title{
        margin-top: 13%;
        margin-bottom: 13%;
    }
</style>
