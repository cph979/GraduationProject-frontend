import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 菜单项数组
        routes: []
    },
    mutations: {
        // 通过state才能访问routes
        initRoutes(state, data) {
            state.routes = data;
        }
    }
})