const express = require('express');
const http = require('http'); 
const path = require('path'); 

const app = express();
const server = http.createServer(app);

const indexRouter = require('./routes/index');

const history = require('connect-history-api-fallback');

app.use(history());

app.use(express.static('public'));

app.use('/', indexRouter);

server.listen(7514, ()=>{
    console.log("서버 실행중");
});