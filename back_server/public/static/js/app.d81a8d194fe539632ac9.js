webpackJsonp([1],{DKzk:function(t,s){},DQG4:function(t,s){},"Ew+q":function(t,s){},NHnr:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("7+uW"),o={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{attrs:{id:"app"}},[s("router-view")],1)},staticRenderFns:[]};var a=e("VU/8")({name:"App"},o,!1,function(t){e("Ew+q")},"data-v-6156bdac",null).exports,n=e("/ocq"),r={name:"Login",data:function(){return{nickName:""}},methods:{login:function(){var t=this;this.$axios.post("/checkNickname",{nickName:this.nickName}).then(function(s){switch(s.data){case 0:alert("닉네임은 공백을 포함할 수 없습니다."),t.nickName="";break;case 1:alert("중복되는 닉네임 입니다."),t.nickName="";break;case 2:alert("사용할 수 없는 닉네임입니다."),t.nickName="";break;case 3:alert("이미 관리자 접속중입니다."),t.nickName="";break;case 4:t.$socket.emit("login",t.nickName),location.href="/#/main"}})}}},c={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"login"}},[t._m(0),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.nickName,expression:"nickName"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Username","aria-label":"Nickname","aria-describedby":"basic-addon1"},domProps:{value:t.nickName},on:{keydown:function(s){return!s.type.indexOf("key")&&t._k(s.keyCode,"enter",13,s.key,"Enter")?null:t.login.apply(null,arguments)},input:function(s){s.target.composing||(t.nickName=s.target.value)}}}),t._v(" "),e("button",{staticClass:"btn btn-secondary",attrs:{type:"button"},on:{click:t.login}},[t._v("login")])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"title"},[s("h1",[this._v("Welcome")]),this._v(" "),s("h2",[this._v("Please login")])])}]};var l=e("VU/8")(r,c,!1,function(t){e("wYA5")},"data-v-12bc6a92",null).exports,u={name:"Main",mounted:function(){var t=this;this.$j(".userList").hide(),this.socket.on("userList",function(s){t.userList=s}),this.socket.on("roomList",function(s){t.roomList=s}),this.socket.on("awesome",function(s){t.chatList.push(s),t.scroll()}),this.socket.on("kickResult",function(){location.href="/#/",t.$router.go()}),this.socket.on("roomList",function(s){t.roomList=s})},data:function(){return{userView:!1,socket:this.$socket,userList:[],chatList:[],msgInput:"",createRoomView:!1,searchRoomView:!1,createRoomName:"",createRoomPassword:"",createRoomSelectGame:"",roomIn:!1,roomList:[]}},methods:{userListView:function(){this.userView=!this.userView,this.userView?this.$j(".userList").stop().slideDown():this.$j(".userList").stop().slideUp()},sendMsg:function(){this.socket.emit("sendMsg",this.msgInput),this.msgInput=""},scroll:function(){var t=document.querySelector(".chating"),s=setInterval(function(){t.scrollTop=t.scrollHeight,clearInterval(s)},10)},kick:function(t){var s=this;if(this.socket.id!==t&&this.userList.findIndex(function(t){return t.id===s.socket.id&&t.admin})>=0){if(1!=confirm("추방 하시겠습니까?"))return;this.socket.emit("kick",t)}},logout:function(){1==confirm("로그아웃 하시겠습니까?")&&(this.socket.emit("logout",this.socket.id),location.href="/#/",this.$router.go())},createRoom:function(){var t=document.querySelector("#selectGame").value;""!==this.createRoomName&&""!==t?(this.socket.emit(t,{roomName:this.createRoomName,roomPassword:this.createRoomPassword,selectGame:t}),this.roomIn=!0,this.createRoomName="",this.createRoomPassword="",location.href="/#/"+t):alert("방 이름 또는 게임을 선택해주세요.")},enterRoom:function(t){var s=this.roomList.find(function(s){return s.roomId===t});if(s.inUser!==s.max){if(""!==s.roomPassword)if(prompt("비밀번호를 입력해주세요.","")!==s.roomPassword)return void alert("비밀번호가 틀렸습니다.");1==confirm("방에들어가시겠습니까?")&&(this.socket.emit(s.selectGame+"In",s.roomId),this.roomIn=!0,location.href="/#/"+s.selectGame)}else alert("방에 빈자리가 없습니다.")}}},d={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"main"}},[e("transition",{attrs:{name:"tr"}},[t.createRoomView?e("div",{staticClass:"createRoom"},[e("h4",[t._v("방만들기")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.createRoomName,expression:"createRoomName"}],staticClass:"form-control",attrs:{type:"text",placeholder:"방이름","aria-label":"roomName","aria-describedby":"basic-addon1"},domProps:{value:t.createRoomName},on:{input:function(s){s.target.composing||(t.createRoomName=s.target.value)}}}),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.createRoomPassword,expression:"createRoomPassword"}],staticClass:"form-control",attrs:{type:"text",placeholder:"비밀번호","aria-label":"roomPassword","aria-describedby":"basic-addon1"},domProps:{value:t.createRoomPassword},on:{input:function(s){s.target.composing||(t.createRoomPassword=s.target.value)}}}),t._v(" "),e("select",{staticClass:"form-select",attrs:{"aria-label":"roomSelect",id:"selectGame"}},[e("option",{attrs:{selected:""}},[t._v("방종류")]),t._v(" "),e("option",{attrs:{value:"chating"}},[t._v("채팅방")]),t._v(" "),e("option",{attrs:{value:"endword"}},[t._v("끝말잇기")]),t._v(" "),e("option",{attrs:{value:"mafia"}},[t._v("마피아")])]),t._v(" "),e("button",{staticClass:"btn btn-warning",attrs:{type:"button"},on:{click:t.createRoom}},[t._v("만들기")]),t._v(" "),e("button",{staticClass:"btn btn-info",attrs:{type:"button"},on:{click:function(s){t.createRoomView=!1}}},[t._v("취소")])]):t._e()]),t._v(" "),e("transition",{attrs:{name:"tr"}},[t.searchRoomView?e("div",{staticClass:"searchRoom"},[e("h4",[t._v("방찾기")]),t._v(" "),e("input",{staticClass:"form-control",attrs:{type:"text",placeholder:"방번호","aria-label":"roomname","aria-describedby":"basic-addon1"}}),t._v(" "),e("button",{staticClass:"btn btn-warning",attrs:{type:"button"}},[t._v("들어가기")]),t._v(" "),e("button",{staticClass:"btn btn-info",attrs:{type:"button"},on:{click:function(s){t.searchRoomView=!1}}},[t._v("취소")])]):t._e()]),t._v(" "),e("div",{staticClass:"myContainer"},[e("div",{staticClass:"right"},[e("div",{staticClass:"title",staticStyle:{"border-radius":"10px 0px 0px 0px"}},[t._v("방 리스트")]),t._v(" "),e("div",{staticClass:"roomMenu"},[e("button",{staticClass:"btn btn-secondary",attrs:{type:"button"},on:{click:function(s){t.createRoomView=!0}}},[t._v("방만들기")]),t._v(" "),e("button",{staticClass:"btn btn-secondary",attrs:{type:"button"},on:{click:function(s){t.searchRoomView=!0}}},[t._v("방찾기")]),t._v(" "),e("button",{staticClass:"btn btn-secondary",attrs:{type:"button"},on:{click:t.logout}},[t._v("로그아웃")])]),t._v(" "),e("div",{staticClass:"roomList"},t._l(t.roomList,function(s){return e("div",{key:s,staticClass:"room",on:{click:function(e){return t.enterRoom(s.roomId)}}},[e("div",{staticClass:"roomName"},[t._v(t._s(s.roomName)+"/"+t._s(s.roomId))]),t._v(" "),e("div",{staticClass:"selectGame"},[t._v(t._s(s.selectGame))]),t._v(" "),e("div",{staticClass:"inUser"},[t._v(t._s(s.inUser)+"/"+t._s(s.max))])])}),0)]),t._v(" "),e("div",{staticClass:"left"},[e("div",{staticClass:"title point",staticStyle:{"border-radius":"0px 10px 0px 0px"},on:{click:t.userListView}},[t._v("유저")]),t._v(" "),e("div",{staticClass:"content"},[e("div",{staticClass:"userList",staticStyle:{"border-radius":"0px 0px 10px 0px"}},t._l(t.userList,function(s){return e("div",{key:s,staticClass:"user",class:{my:s.id===t.socket.id},on:{click:function(e){return t.kick(s.id)}}},[t._v(t._s(s.nickName))])}),0),t._v(" "),e("div",{staticClass:"publicChat"},[e("div",{staticClass:"title"},[t._v("채팅")]),t._v(" "),e("div",{staticClass:"chating"},t._l(t.chatList,function(s){return e("div",{key:s,staticClass:"chat",class:{my:s.id===t.socket.id}},["SYSTEM"===s.id?e("div",{staticClass:"systemChat"},[e("b",[t._v(t._s(s.msg))])]):e("div",{staticClass:"userChat"},[t._v(t._s(s.nickName)+" : "+t._s(s.msg))])])}),0),t._v(" "),e("div",{staticClass:"send"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.msgInput,expression:"msgInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"message","aria-label":"message","aria-describedby":"basic-addon1"},domProps:{value:t.msgInput},on:{keydown:function(s){return!s.type.indexOf("key")&&t._k(s.keyCode,"enter",13,s.key,"Enter")?null:t.sendMsg.apply(null,arguments)},input:function(s){s.target.composing||(t.msgInput=s.target.value)}}}),t._v(" "),e("button",{staticClass:"btn btn-outline-dark",attrs:{type:"button"},on:{click:t.sendMsg}},[t._v(">>")])])])])])])],1)},staticRenderFns:[]};var m=e("VU/8")(u,d,!1,function(t){e("DKzk")},"data-v-71c3f3c0",null).exports,v={name:"Chating",mounted:function(){var t=this;this.socket.on("chating",function(s){t.userList=s}),this.socket.on("roomInfo",function(s){t.roomInfo=s}),this.socket.on("chatingAwesome",function(s){t.chatList.push(s),t.scroll()}),this.socket.on("kickChatingResult",function(){location.href="/#/main",t.socket.emit("leaveRoom",t.roomInfo.roomId)})},data:function(){return{socket:this.$socket,roomInfo:[],userList:[],msgInput:"",chatList:[]}},methods:{sendMsg:function(){""!==this.msgInput&&(this.socket.emit("chatingMsg",{msg:this.msgInput,roomId:this.roomInfo.roomId}),this.msgInput="")},scroll:function(){var t=document.querySelector(".chating"),s=setInterval(function(){t.scrollTop=t.scrollHeight,clearInterval(s)},10)},outRoom:function(){1==confirm("정말 나가시겠습니까?")&&(this.socket.emit("roomOut"),location.href="/#/main")},kick:function(t){var s=this;if(!(t===this.socket.id||this.userList.findIndex(function(s){return s.id===t&&s.admin})>=0)&&(this.socket.id===this.roomInfo.host||this.userList.findIndex(function(t){return t.id===s.socket.id&&t.admin})>=0)){if(1!=confirm("추방 하시겠습니까?"))return;this.socket.emit("kickChating",t)}}}},h={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"chating"}},[e("div",{staticClass:"right"},[e("div",{staticClass:"title"},[t._v("방정보")]),t._v(" "),e("div",{staticClass:"roomInfo"},[e("div",{staticClass:"roomName"},[t._v(t._s(t.roomInfo.roomName))]),t._v(" "),e("div",{staticClass:"roomId"},[t._v(t._s(t.roomInfo.roomId))])]),t._v(" "),e("div",{staticClass:"title"},[t._v("유저")]),t._v(" "),e("div",{staticClass:"userList"},t._l(t.userList,function(s){return e("div",{key:s,staticClass:"user",class:{my:s.id===t.socket.id},on:{click:function(e){return t.kick(s.id)}}},[t._v(t._s(s.nickName)),s.id===t.roomInfo.host?e("div",{staticClass:"host"},[t._v("(방장)")]):t._e()])}),0),t._v(" "),e("div",{staticClass:"menu"},[e("button",{staticClass:"btn btn-outline-dark",attrs:{type:"button",id:"out"},on:{click:t.outRoom}},[t._v("나가기")])])]),t._v(" "),e("div",{staticClass:"left"},[e("div",{staticClass:"publicChat"},[e("div",{staticClass:"title"},[t._v("채팅")]),t._v(" "),e("div",{staticClass:"chating"},t._l(t.chatList,function(s){return e("div",{key:s,staticClass:"chat",class:{my:s.id===t.socket.id}},["SYSTEM"===s.id?e("div",{staticClass:"systemChat"},[e("b",[t._v(t._s(s.msg))])]):e("div",{staticClass:"userChat"},[t._v(t._s(s.nickName)+" : "+t._s(s.msg))])])}),0),t._v(" "),e("div",{staticClass:"send"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.msgInput,expression:"msgInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"message","aria-label":"message","aria-describedby":"basic-addon1"},domProps:{value:t.msgInput},on:{keydown:function(s){return!s.type.indexOf("key")&&t._k(s.keyCode,"enter",13,s.key,"Enter")?null:t.sendMsg.apply(null,arguments)},input:function(s){s.target.composing||(t.msgInput=s.target.value)}}}),t._v(" "),e("button",{staticClass:"btn btn-outline-dark",attrs:{type:"button"},on:{click:t.sendMsg}},[t._v(">>")])])])])])},staticRenderFns:[]};var p=e("VU/8")(v,h,!1,function(t){e("jH2d")},"data-v-76ea70f0",null).exports,f={name:"EndWord",mounted:function(){var t=this;this.socket.on("endword",function(s){t.userList=s}),this.socket.on("roomInfo",function(s){t.roomInfo=s}),this.socket.on("endwordAwesome",function(s){t.chatList.push(s),t.scroll()}),this.socket.on("kickChatingResult",function(){location.href="/#/main",t.socket.emit("leaveRoom",t.roomInfo.roomId)})},data:function(){return{socket:this.$socket,roomInfo:[],userList:[],msgInput:"",chatList:[],game:!1}},methods:{sendMsg:function(){""!==this.msgInput&&(this.socket.emit("endwordMsg",{msg:this.msgInput,roomId:this.roomInfo.roomId}),this.msgInput="")},scroll:function(){var t=document.querySelector(".chating"),s=setInterval(function(){t.scrollTop=t.scrollHeight,clearInterval(s)},10)},outRoom:function(){1==confirm("정말 나가시겠습니까?")&&(this.socket.emit("roomOut"),location.href="/#/main")},kick:function(t){var s=this;if(!(t===this.socket.id||this.userList.findIndex(function(s){return s.id===t&&s.admin})>=0)&&(this.socket.id===this.roomInfo.host||this.userList.findIndex(function(t){return t.id===s.socket.id&&t.admin})>=0)){if(1!=confirm("추방 하시겠습니까?"))return;this.socket.emit("kickChating",t)}}}},_={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"endword"}},[e("div",{staticClass:"waitRoom"},[t._m(0),t._v(" "),e("div",{staticClass:"left"},[e("div",{staticClass:"publicChat"},[e("div",{staticClass:"title",staticStyle:{"border-radius":"0px 10px 0px 0px"}},[t._v("채팅")]),t._v(" "),e("div",{staticClass:"chating"},t._l(t.chatList,function(s){return e("div",{key:s,staticClass:"chat",class:{my:s.id===t.socket.id}},["SYSTEM"===s.id?e("div",{staticClass:"systemChat"},[e("b",[t._v(t._s(s.msg))])]):e("div",{staticClass:"userChat"},[t._v(t._s(s.nickName)+" : "+t._s(s.msg))])])}),0),t._v(" "),e("div",{staticClass:"send"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.msgInput,expression:"msgInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"message","aria-label":"message","aria-describedby":"basic-addon1"},domProps:{value:t.msgInput},on:{keydown:function(s){return!s.type.indexOf("key")&&t._k(s.keyCode,"enter",13,s.key,"Enter")?null:t.sendMsg.apply(null,arguments)},input:function(s){s.target.composing||(t.msgInput=s.target.value)}}}),t._v(" "),e("button",{staticClass:"btn btn-outline-dark",attrs:{type:"button"},on:{click:t.sendMsg}},[t._v(">>")])])])])])])},staticRenderFns:[function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"right"},[e("div",{staticClass:"title",staticStyle:{"border-radius":"10px 0px 0px 0px"}},[t._v("방메뉴")]),t._v(" "),e("div",{staticClass:"waitMenu"},[e("div",{staticClass:"roomInfo"},[t._v("방이름(0)")]),t._v(" "),e("div",{staticClass:"menu"},[e("button",{staticClass:"btn btn-secondary",attrs:{type:"button"}},[t._v("시작하기")]),t._v(" "),e("button",{staticClass:"btn btn-secondary",attrs:{type:"button"}},[t._v("나가기")])])]),t._v(" "),e("div",{staticClass:"title"},[t._v("유저")]),t._v(" "),e("div",{staticClass:"userList"},[e("div",{staticClass:"user"},[t._v("임상언")]),e("div",{staticClass:"user"},[t._v("임상언")]),e("div",{staticClass:"user"},[t._v("임상언")]),e("div",{staticClass:"user"},[t._v("임상언")]),t._v(" "),e("div",{staticClass:"user"},[t._v("임상언")]),e("div",{staticClass:"user"},[t._v("임상언")]),e("div",{staticClass:"user"},[t._v("임상언")]),e("div",{staticClass:"user"},[t._v("임상언")])])])}]};var k=e("VU/8")(f,_,!1,function(t){e("DQG4")},"data-v-4dc84aba",null).exports;i.a.use(n.a);var g=new n.a({routes:[{path:"/",name:"Login",component:l},{path:"/main",name:"Main",component:m},{path:"/chating",name:"Chating",component:p},{path:"/endword",name:"EndWord",component:k}]}),C=(e("qb6w"),e("mtWM")),b=e.n(C),y=e("7t+N"),I=e.n(y);i.a.config.productionTip=!1,i.a.prototype.$axios=b.a;var w=io();i.a.prototype.$socket=w,i.a.prototype.$j=I.a,new i.a({el:"#app",router:g,components:{App:a},template:"<App/>"})},jH2d:function(t,s){},qb6w:function(t,s){},wYA5:function(t,s){}},["NHnr"]);
//# sourceMappingURL=app.d81a8d194fe539632ac9.js.map