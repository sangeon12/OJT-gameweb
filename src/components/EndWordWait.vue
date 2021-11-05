<template>
    <div id="endwordwait">

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
</template>

<script>
export default {
    name: 'EndWordWait'
}
</script>

<style scoped>
    #endwordwait{
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