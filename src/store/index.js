import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/api";
import {Notification} from 'element-ui';
import SockJS from 'sockjs-client'
import '../utils/stomp'

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
  state: {
    // 菜单项数组
    routes: [],
    sessions: {},
    currentSession: null,
    filterKey: '',
    currentHr: JSON.parse(window.sessionStorage.getItem('user')),
    hrs: [],
    stompClient: null,
    isDot: {},
    desKey: 'cph97091'
  },
  mutations: {
    initHr(state, hr) {
      state.currentHr = hr;
    },
    // 通过state才能访问routes
    initRoutes(state, data) {
      state.routes = data;
    },
    changeCurrentSession(state, currentSession) {
      Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false);
      state.currentSession = currentSession;
    },
    addMessage(state, msgObj) {
      let msg = state.sessions[state.currentHr.username + '#' + msgObj.to];
      if (!msg) {
        // 此操作添加的消息记录，Vuex无法检测到，因为都是后来添加的
        // state.sessions[state.currentHr.username + '#' + msgObj.to] = [];
        Vue.set(state.sessions, state.currentHr.username + '#' + msgObj.to, []);
      }
      state.sessions[state.currentHr.username + '#' + msgObj.to].push({
        content: msgObj.content,
        date: new Date(),
        self: !msgObj.notSelf
      })
    },
    INIT_DATA(state) {
      // 浏览器本地的历史聊天记录可以在这里完成
      let data = localStorage.getItem('vue-chat-session');
      if (data) {
          state.sessions = JSON.parse(data);
      }
    },
    INIT_HRS(state, data) {
      state.hrs = data;
    }
  },
  // 异步操作在action里做
  actions: {
    socketConnect(context) {
      let sockJS = new SockJS('/ws/emp');
      context.state.stompClient = Stomp.over(sockJS);
      context.state.stompClient.connect({}, success => {
        context.state.stompClient.subscribe('/user/queue/chat', msg => {
          let receiveMsg = JSON.parse(msg.body);
          if (!this.state.currentSession || receiveMsg.from != this.state.currentSession.username) {
            Notification.info({
              title: '收到来自' + receiveMsg.name + '的新消息',
              message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
              position: 'bottom-right',
            })
            Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true);
          }
          receiveMsg.notSelf = true;
          receiveMsg.to = receiveMsg.from;
          // console.log('receive>>>' + JSON.stringify(receiveMsg))
          context.commit('addMessage', receiveMsg);
        })
      }, error => {})
    },
    initData(context) {
      context.commit('INIT_DATA');
      getRequest('/chat/hrs').then(resp => {
        if (resp) {
          context.commit('INIT_HRS', resp);
        }
      })
    }
  }

})

store.watch(function (state) {
  return state.sessions
}, function (val) {
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
  deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;