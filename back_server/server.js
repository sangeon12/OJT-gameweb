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
let endWordInUser = [];//끝말잇기게임 참여자 목록
let mafiaInUser = [];//마피아게임 참여자 목록
let log = [];

const nullCheck = /\s/;//공백 체크

app.post('/checkNickname', async (req, res) =>{
    const nickName = req.body.nickName;
    if(nickName === "" || nullCheck.exec(nickName) || nickName.indexOf('ㅤ') >= 0){
        res.json(0);
        return;
    }
    if(userList.findIndex(x => x.nickName === nickName) >= 0){
        res.json(1);
        return;
    }
    if(nickName.indexOf('임상언') >= 0 || nickName.indexOf('관리자') >= 0){
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
    socket.on('disconnect', ()=>{
        outUser(socket.id, '님 접송종료', false);
        roomOut(socket.id);
    });

    socket.on('login', data=>{
        let nickName = data;
        let admin = false;
        if(data === adminPassword){
            nickName = '임상언(관리자)'; 
            admin = true;
            adminOn = true;
        } 
        userList.push({id:socket.id, nickName, nickName, admin:admin});
        systemMsg(nickName + '님이 접속하셨습니다.', null);
        io.emit('userList', userList);
        io.emit('roomList', roomList);
    });

    socket.on('logout', data=>{
        outUser(data, '님이 접송종료하셨습니다.', false);
    });

    socket.on('sendMsg', data =>{   
        if(data === "" || data.length > 200) return;
        let sendUser = userList.find(x => x.id === socket.id);
        io.emit('awesome', {id:sendUser.id, nickName:sendUser.nickName, msg:data});
    }); 

    socket.on('kick', data =>{
        outUser(data, '님이 추방당했습니다.', true);
    })

    socket.on('roomOut', () => {
        roomOut(socket.id);
    });

    socket.on('chating', data=>{
        roomList.push({roomName:data.roomName, roomPassword:data.roomPassword, selectGame:data.selectGame, roomId:roomId , host:socket.id, max:4, inUser:0});
        io.emit('roomList', roomList);
        let user = userList.find(x => x.id === socket.id);
        chatingInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:roomId});
        socket.join(roomId);
        roomListView(roomId, true);
        systemMsg(user.nickName+'님이 방을 만들었습니다.', roomId);
        roomId++;
    });

    socket.on('chatingIn', data=>{
        let user = userList.find(x => x.id === socket.id);
        chatingInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:data});
        socket.join(data);
        roomListView(data, true);
        systemMsg(user.nickName+'님이 들어왔습니다.', data);
    });

    socket.on('chatingMsg', data =>{
        if(data.msg === "" || data.msg.length > 200) return;
        let sendUser = userList.find(x => x.id === socket.id);
        io.to(data.roomId).emit('chatingAwesome', {id:sendUser.id, nickName:sendUser.nickName, msg:data.msg});
    });

    socket.on('kickChating', data =>{
        roomKick(data);
    });

    socket.on('leaveRoom', data=>{
        socket.leave(data);
        let roomInfo = roomList.find(x => x.roomId === data);
        if(roomInfo.host === socket.id){
            let socketRooms = io.of("/").adapter.rooms.get(data).values();
            roomInfo.host = socketRooms.next().value;
        } 
        roomListView(roomInfo.roomId, false);
    });

    function outUser(id, msg, kick){
        let idx = userList.findIndex(x => x.id === id);
        if(idx < 0) return;
        let outUser = userList.splice(idx, 1)[0];
        if(outUser.admin) adminOn = false;
        systemMsg(outUser.nickName + msg, null);
        io.emit('userList', userList);
        if(kick) io.to(id).emit('kickResult');
    }

    function systemMsg(msg, id){
        console.log(msg, socket.id);
        log.push(msg);
        let roomInfo = roomList.find(x => x.roomId === id);
        switch(id){
            case null:
                io.emit('awesome', {id:'SYSTEM', nickName:'SYSTEM', msg:msg});
                break;
            default:
                io.to(id).emit(roomInfo.selectGame+'Awesome', {id:'SYSTEM', nickName:'SYSTEM', msg:msg});   
                break;
        }
    }

    function roomListView(id, inOut){
        let roomUserList = [];
        let roomInfo = roomList.find(x => x.roomId === id);
        if(roomInfo.selectGame === 'chating'){
            chatingInUser.forEach((e)=>{
                if(e.roomId === id) roomUserList.push(e);
            });
        }
        if(inOut) roomInfo.inUser++;
        else{
            roomInfo.inUser--;
            if(roomInfo.inUser === 0) roomList.splice(x => x.roomId === roomInfo.roomId);
            else if(roomInfo.host === socket.id){
                let socketRooms = io.of("/").adapter.rooms.get(roomInfo.roomId).values();
                roomInfo.host = socketRooms.next().value;
            } 
        }
        io.to(id).emit('roomInfo', roomInfo);
        io.to(id).emit(roomInfo.selectGame, roomUserList);
        io.emit('roomList', roomList);
    }

    function roomOut(id){
        let chatingOutUser = chatingInUser.findIndex(x => x.id === id);
        let endWordOutUser = endWordInUser.findIndex(x => x.id === id);
        let mafiaOutUser = mafiaInUser.findIndex(x => x.id === id);
        if(chatingOutUser >= 0){
            roomOutUser = chatingInUser.splice(chatingOutUser, 1)[0];
            socket.leave(roomOutUser.roomId);
            systemMsg(roomOutUser.nickName + '님이 나가셨습니다.', roomOutUser.roomId);
            roomListView(roomOutUser.roomId, false);
            socket.emit('userList', userList);
        }
    }

    function roomKick(id){
        let chatingOutUser = chatingInUser.findIndex(x => x.id === id);
        let endWordOutUser = endWordInUser.findIndex(x => x.id === id);
        let mafiaOutUser = mafiaInUser.findIndex(x => x.id === id);
        if(chatingOutUser >= 0){
            roomOutUser = chatingInUser.splice(chatingOutUser, 1)[0];
            io.to(id).emit('kickChatingResult');
            io.to(id).emit('userList', userList);
            systemMsg(roomOutUser.nickName + '님이 추방당하셨습니다.', roomOutUser.roomId);
        }
    }
});

server.listen(7514, ()=>{
    console.log("localhost:7514 에서 서버 실행중");
});
