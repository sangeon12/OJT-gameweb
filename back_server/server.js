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

const {getWord} = require('./searchWord.js');


let userList = []; //현재 접속한 유저 리스트
let adminPassword = 'admin'; //관리자 패스워드
let adminOn = false; //관리자 접속 여부
let roomId = 0;
let roomList = []; //방목록
let chatingInUser = []; //채팅방 참여자 목록
let endWordInUser = []; //끝말잇기게임 참여자 목록
let mafiaInUser = []; //마피아게임 참여자 목록
let log = []; //시스템 메시지가 저장되는 리스트

const nullCheck = /\s/; //공백 체크

app.post('/checkNickname', async (req, res) =>{ //사용하지 못하는 닉네임을 체크
    const nickName = req.body.nickName;
    if(nickName === "" || nullCheck.exec(nickName) || nickName.indexOf('ㅤ') >= 0){
        res.json(0); //닉네임에 공백이 포함될 때
        return;
    }
    if(userList.findIndex(x => x.nickName === nickName) >= 0){
        res.json(1); //닉네임이 중복될 때
        return;
    }
    if(nickName.indexOf('임상언') >= 0 || nickName.indexOf('관리자') >= 0){
        res.json(2); //닉네임에 관리자, 임상언이 포합될 때
        return;
    }
    if(nickName === adminPassword){
        if(adminOn){
            res.json(3); //관리자가 이미 접속중일 때
            return;
        }
    }
    if(nickName.length > 5){
        res.json(4); //닉네임이 5글자를 넘을 때
        return;
    }
    res.json(5); //아무 이상없을 떄
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
    });
//----------------------------------------------------------------------------------------------------------------
    socket.on('chating', data=>{
        let user = userList.find(x => x.id === socket.id);
        chatingInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:roomId});
        createRoom(data, user);
    });

    socket.on('chatingIn', data=>{
        let user = userList.find(x => x.id === socket.id);
        chatingInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:data});
        enterRoom(data, user);
    });

    socket.on('chatingMsg', data =>{
        if(data.msg === "" || data.msg.length > 200) return;
        let sendUser = userList.find(x => x.id === socket.id);
        io.to(data.roomId).emit('chatingAwesome', {id:sendUser.id, nickName:sendUser.nickName, msg:data.msg});
    });
//----------------------------------------------------------------------------------------------------------------
    socket.on('endword', data =>{
        let user = userList.find(x => x.id === socket.id);
        endWordInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:roomId, score:0, ready:true});
        createRoom(data, user);
    });

    socket.on('endwordIn', data=>{
        let user = userList.find(x => x.id === socket.id);
        endWordInUser.push({id:socket.id, nickName:user.nickName, admin:user.admin, roomId:data, score:0, ready:false});
        enterRoom(data, user);
    });

    socket.on('endwordMsg', data =>{
        if(data.msg === "" || data.msg.length > 200) return;
        let sendUser = userList.find(x => x.id === socket.id);
        io.to(data.roomId).emit('endwordAwesome', {id:sendUser.id, nickName:sendUser.nickName, msg:data.msg});
    });

    socket.on('endwordReady', ()=>{
        let user = endWordInUser.find(x => x.id === socket.id);
        user.ready = !user.ready;
        roomUserList = [];
        endWordInUser.forEach((e) =>{
            if(e.roomId === user.roomId) roomUserList.push(e);
        });
        io.to(user.roomId).emit('endwordList', roomUserList);
    });

    socket.on('endwordGameStart', data=>{
        io.emit('endwordGameStart', data);
    });

    socket.on('searchWord', data =>{
        resultWord(data.word, data.roomId);
    });

    function resultWord(word, roomId){ //단어를 검색하는 함수
        getWord(word).then((v) => {
            io.to(roomId).emit('resultWord', v.result);
        });
    }
//---------------------------------------------------------------------------------------------[]
    socket.on('roomOut', () => {
        roomOut(socket.id);
    });

    socket.on('kickRoom', data =>{
        roomKick(data);
    });

    socket.on('leaveRoom', data=>{
        socket.leave(data);
        let roomInfo = roomList.find(x => x.roomId === data);
        if(roomInfo.host === socket.id){
            let socketRooms = io.of("/").adapter.rooms.get(data).values();
            roomInfo.host = socketRooms.next().value;
        } 
        roomListUpdata(roomInfo.roomId, false);
        io.to(socket.id).emit('userList', userList);
    });
//----------------------------------------------------------------------------------------------------------------
    function createRoom(roomInfo, user){
        roomList.push({roomName:roomInfo.roomName, roomPassword:roomInfo.roomPassword, selectGame:roomInfo.selectGame, roomId:roomId , host:socket.id, max:8, inUser:0});
        io.emit('roomList', roomList);
        socket.join(roomId);
        roomListUpdata(roomId, true);
        systemMsg(user.nickName+'님이 방을 만들었습니다.', roomId);
        roomId++;
    }

    function enterRoom(getRoomId, user){
        socket.join(getRoomId);
        roomListUpdata(getRoomId, true);
        systemMsg(user.nickName+'님이 들어왔습니다.', getRoomId);
    }

    function systemMsg(msg, getRoomId){ //시스템 메시지, 방 id를 받아 시스템 메시지를 client에 보내는 함수 
        console.log(msg, socket.id);
        log.push(msg);
        let roomInfo = roomList.find(x => x.roomId === getRoomId);
        switch(getRoomId){
            case null:
                io.emit('awesome', {id:'SYSTEM', nickName:'SYSTEM', msg:msg});
                break;
            default:
                if(roomInfo !== undefined) io.to(getRoomId).emit(roomInfo.selectGame+'Awesome', {id:'SYSTEM', nickName:'SYSTEM', msg:msg});   
                break;
        }
    }

    function roomListUpdata(getRoomId, inOut){ //방정보를 업데이트하고 방정보를 client에 보내는 함수
        let roomUserList = []; //가져온 방id에 들어가있는 유저를 저장하는 리스트
        let roomInfo = roomList.find(x => x.roomId === getRoomId);
        switch(roomInfo.selectGame){
            case 'chating':
                chatingInUser.forEach((e)=>{
                    if(e.roomId === getRoomId) roomUserList.push(e);
                });
                break
            case 'endword':
                endWordInUser.forEach((e) =>{
                    if(e.roomId === getRoomId) roomUserList.push(e);
                });
                break
        }
        if(inOut) roomInfo.inUser++;
        else{
            roomInfo.inUser--;
            if(roomInfo.inUser === 0) roomList.splice(x => x.roomId === getRoomId);
            else if(roomInfo.host === socket.id){
                let socketRooms = io.of("/").adapter.rooms.get(getRoomId).values();
                roomInfo.host = socketRooms.next().value;
            } 
        }
        io.to(getRoomId).emit('roomInfo', roomInfo);
        io.to(getRoomId).emit(roomInfo.selectGame+'List', roomUserList);
        io.emit('roomList', roomList);
    }

    function outUser(id, msg, kick){ //소켓 id, 시스템 메시지, 추방 여부등을 받아 유저를 로그아웃 시키는 함수
        let idx = userList.findIndex(x => x.id === id);
        if(idx < 0) return;
        let outUser = userList.splice(idx, 1)[0];
        if(outUser.admin) adminOn = false;
        systemMsg(outUser.nickName + msg, null);
        io.emit('userList', userList);
        roomOut(id);
        if(kick) io.to(id).emit('kickResult');
    }

    function roomOut(id){ //방을 나갈 때 실행되는 함수
        let chatingOutUser = chatingInUser.findIndex(x => x.id === id);
        let endWordOutUser = endWordInUser.findIndex(x => x.id === id);
        let mafiaOutUser = mafiaInUser.findIndex(x => x.id === id);
        if(chatingOutUser >= 0){
            roomOutUser = chatingInUser.splice(chatingOutUser, 1)[0];
            socket.leave(roomOutUser.roomId);
            roomListUpdata(roomOutUser.roomId, false);
            systemMsg(roomOutUser.nickName + '님이 나가셨습니다.', roomOutUser.roomId);
        }else if(endWordOutUser >= 0){
            roomOutUser = endWordInUser.splice(endWordOutUser, 1)[0];
            socket.leave(roomOutUser.roomId);
            roomListUpdata(roomOutUser.roomId, false);
            systemMsg(roomOutUser.nickName + '님이 나가셨습니다.', roomOutUser.roomId);
        }
        socket.emit('userList', userList);
    }

    function roomKick(id){ //방에서 추방 당했을 때 실행되는 함수
        let chatingOutUser = chatingInUser.findIndex(x => x.id === id);
        let endWordOutUser = endWordInUser.findIndex(x => x.id === id);
        let mafiaOutUser = mafiaInUser.findIndex(x => x.id === id);
        if(chatingOutUser >= 0){
            roomOutUser = chatingInUser.splice(chatingOutUser, 1)[0];
            systemMsg(roomOutUser.nickName + '님이 추방당하셨습니다.', roomOutUser.roomId);
            io.to(id).emit('chatingKickResult');
        }else if(endWordOutUser >= 0){
            roomOutUser = endWordInUser.splice(endWordOutUser, 1)[0];
            systemMsg(roomOutUser.nickName + '님이 추방당하셨습니다.', roomOutUser.roomId);
            io.to(id).emit('enwordKickResult');
        }
    }
});

server.listen(7514, ()=>{
    console.log("localhost:7514 에서 서버 실행중");
});
