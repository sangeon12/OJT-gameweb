const express = require('express');
const http = require('http'); 
const path = require('path'); 
const bodyParser = require('body-parser');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const indexRouter = require('./routes/index');

const history = require('connect-history-api-fallback');

app.use(history());

app.use(express.static('public'));

app.use('/', indexRouter);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


let userList = [];//현재 접속한 유저 리스트
let managerOn = false;//관리자 접속 여부
app.post('/checkNickname', async (req, res) =>{
    const nickName = req.body.nickName;
    const nullCheck = /\s/;
    if(nickName === "" || nullCheck.exec(nickName) || nickName.indexOf('ㅤ') >= 0){
        res.json(0);
        return;
    }
    if(userList.findIndex(x => x.nickName === nickName) >= 0){
        res.json(1);
        return;
    }
    if(nickName.indexOf('임상언') >= 0){
        res.json(2);
        return;
    }
    if(managerOn){
        res.json(3);
        return;
    }
    res.json(4);
}); 

io.on("connect", socket =>{
    console.log(socket.id+'접속');

    socket.on('login', data=>{
        let nickName = data;
        let manager = false;
        if(data === '9910'){
            nickName = '임상언'; 
            manager = true;
            managerOn = true;
        } 
        userList.push({id:socket.id, nickName, nickName, manager:manager});
        console.log(userList);
    });
});

server.listen(7514, ()=>{
    console.log("localhost:7514 에서 서버 실행중");
});
