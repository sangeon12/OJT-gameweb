webpackJsonp([1],{AChQ:function(t,e){},"Ew+q":function(t,e){},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("7+uW"),n={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var a=s("VU/8")({name:"App"},n,!1,function(t){s("Ew+q")},"data-v-6156bdac",null).exports,o=s("/ocq"),c={name:"Login",data:function(){return{nickName:""}},methods:{login:function(){var t=this;this.$axios.post("/checkNickname",{nickName:this.nickName}).then(function(e){switch(e.data){case 0:alert("닉네임은 공백을 포함할 수 없습니다.");break;case 1:alert("중복되는 닉네임 입니다.");break;case 2:alert("사용할 수 없는 닉네임입니다.");break;case 3:alert("이미 관리자 접속중입니다.");break;case 4:t.$socket.emit("login",t.nickName),location.href="/#/main"}})}}},r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"login"}},[t._m(0),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.nickName,expression:"nickName"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Username","aria-label":"Nickname","aria-describedby":"basic-addon1"},domProps:{value:t.nickName},on:{input:function(e){e.target.composing||(t.nickName=e.target.value)}}}),t._v(" "),s("button",{staticClass:"btn btn-secondary",attrs:{type:"button"},on:{click:t.login,keyDown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.login.apply(null,arguments)}}},[t._v("login")])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"title"},[e("h1",[this._v("Welcome")]),this._v(" "),e("h2",[this._v("Please login")])])}]};var l=s("VU/8")(c,r,!1,function(t){s("pEtT")},"data-v-32ef22d9",null).exports,u={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"main"}},[t._m(0),t._v(" "),s("div",{staticClass:"left"},[s("div",{staticClass:"title point",staticStyle:{"border-radius":"0px 10px 0px 0px"},on:{click:t.userListView}},[t._v("유저 리스트")]),t._v(" "),s("div",{staticClass:"content"},[s("div",{staticClass:"userList"},t._l(t.userList,function(e){return s("div",{key:e,staticClass:"user",class:{my:e.id===t.socket.id}},[t._v(t._s(e.nickName))])}),0),t._v(" "),s("div",{staticClass:"publicChat"},[s("div",{staticClass:"title"},[t._v("채팅")]),t._v(" "),s("div",{staticClass:"chating"},t._l(t.chatList,function(e){return s("div",{key:e,staticClass:"chat",class:{my:e.id===t.socket.id}},[t._v(t._s(e.nickName)+" : "+t._s(e.msg))])}),0),t._v(" "),s("div",{staticClass:"send"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.msgInput,expression:"msgInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"message","aria-label":"message","aria-describedby":"basic-addon1"},domProps:{value:t.msgInput},on:{input:function(e){e.target.composing||(t.msgInput=e.target.value)}}}),t._v(" "),s("button",{staticClass:"btn btn-outline-dark",attrs:{type:"button"},on:{click:t.sendMsg,keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.sendMsg.apply(null,arguments)}}},[t._v(">>")])])])])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"right"},[s("div",{staticClass:"title",staticStyle:{"border-radius":"10px 0px 0px 0px"}},[t._v("방 리스트")]),t._v(" "),s("div",{staticClass:"roomMenu"},[s("button",{staticClass:"btn btn-success",attrs:{type:"button"}},[t._v("방만들기")]),t._v(" "),s("button",{staticClass:"btn btn-danger",attrs:{type:"button"}},[t._v("방찾기")])]),t._v(" "),s("div",{staticClass:"roomList"},[s("div",{staticClass:"room"},[t._v("방")]),t._v(" "),s("div",{staticClass:"room"},[t._v("방")]),t._v(" "),s("div",{staticClass:"room"},[t._v("방")]),t._v(" "),s("div",{staticClass:"room"},[t._v("방")])])])}]};var d=s("VU/8")({name:"Main",mounted:function(){var t=this;this.$j(".userList").hide(),this.socket.on("userLogin",function(e){t.userList=e}),this.$axios.post("/getNickName",{id:this.socket.id}).then(function(e){t.nickName=e.data}),this.socket.on("awesome",function(e){t.chatList.push(e)})},data:function(){return{userView:!1,socket:this.$socket,nickName:"",userList:[],chatList:[],msgInput:""}},methods:{userListView:function(){this.userView=!this.userView,this.userView?this.$j(".userList").stop().slideDown():this.$j(".userList").stop().slideUp()},sendMsg:function(){this.socket.emit("sendMsg",this.msgInput),this.msgInput=""}}},u,!1,function(t){s("AChQ")},"data-v-94381398",null).exports;i.a.use(o.a);var p=new o.a({routes:[{path:"/",name:"Login",component:l},{path:"/main",name:"Main",component:d}]}),v=(s("qb6w"),s("mtWM")),m=s.n(v),h=s("7t+N"),_=s.n(h);i.a.config.productionTip=!1,i.a.prototype.$axios=m.a;var k=io();i.a.prototype.$socket=k,i.a.prototype.$j=_.a,new i.a({el:"#app",router:p,components:{App:a},template:"<App/>"})},pEtT:function(t,e){},qb6w:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.00baa67995cb8720aa31.js.map