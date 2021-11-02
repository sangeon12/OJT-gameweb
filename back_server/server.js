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
let adminPassword = 'admin';//관리자 패스워드
let adminOn = false;//관리자 접속 여부
let roomId = 0;
let roomList = [];//방목록
let chatingInUser = [];//채팅방 참여자 목록
let endwordInUser = [];//끝말잇기게임 참여자 목록
let mafiaInUser = [];//마피아게임 참여자 목록

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
    if(nickName.indexOf('임상언') >= 0 || nickName.indexOf('SYSTEM') >= 0){
        res.json(2);
        return;
    }
    if(nickName === adminPassword){
        if(adminOn){
            res.json(3);
            return;
        }
    }
    res.json(4);
});

io.on("connect", socket =>{
    console.log(socket.id);
    socket.on('disconnect', ()=>{
        outUser(socket.id, '님 접송종료', false);
    });

    socket.on('login', data=>{
        let nickName = data;
        let admin = false;
        if(data === adminPassword){
            nickName = '임상언'; 
            admin = true;
            adminOn = true;
        } 
        userList.push({id:socket.id, nickName, nickName, admin:admin});
        systemMsg(nickName + '님이 접속하셨습니다.');
        io.emit('userList', userList);
    });

    socket.on('logout', data=>{
        outUser(data, '님이 접송종료하셨습니다.', false);
    });

    socket.on('sendMsg', data =>{   
        let sendUser = userList.find(x => x.id === socket.id);
        io.emit('awesome', {id:sendUser.id, nickName:sendUser.nickName, msg:data});
    }); 

    socket.on('kick', data =>{
        outUser(data, '님이 추방당했습니다.', true);
    })

    function outUser(id, msg, kick){
        let idx = userList.findIndex(x => x.id === id);
        if(idx < 0) return;
        let outUser = userList.splice(idx, 1)[0];
        if(outUser.admin) adminOn = false;
        systemMsg(outUser.nickName + msg);
        io.emit('userList', userList);
        if(kick) io.emit('kickResult', id);
    }

    function systemMsg(msg){
        console.log(msg);
        io.emit('systemMsg', msg);
    }

    socket.on('chating', data=>{
        roomList.push({roomName:data.roomName, roomPassword:data.roomPassword, selectGame:data.selectGame, roomId:roomId , host:socket.id, max:8, user:1});
        io.emit('roomList', roomList);
        let user = userList.find(x => x.id === socket.id);
        chatingInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:roomId});
    });
});

server.listen(7514, ()=>{
    console.log("localhost:7514 에서 서버 실행중");
});
