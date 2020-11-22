// 封装网络请求

import axios from 'axios';
// 在js文件中单独引入elementUI消息提示组件
import { Message } from 'element-ui';

import router from "@/router";

// 主要封装响应，集中处理服务器响应，使用axios响应拦截器
axios.interceptors.response.use(success => {
    // 说明是业务上的错误，后端刻意返回500的情况
    // success.status是浏览器的响应码,后者则是后端手动返回的响应码
    if (success.status && success.status == 200 && success.data.status == 500) {
        Message.error({message: success.data.msg, duration:2000, showClose:true})
        return;
    }
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: '服务器被吃了( ╯□╰ )', duration:2000, showClose:true})
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员', duration:2000, showClose:true})
    } else if (error.response.status == 401) {
        Message.error({message: '尚未登录，请登录', duration:2000, showClose:true});
        router.replace('/');
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg, duration:2000})
        } else {
            Message.error({message: '未知错误!', duration:2000, showClose:true})
        }
    }
    return;
})

let base = '';
/*
  SpringBoot-security表单验证只能通过KeyValue键值对形式传递
  这里做了处理，使得能向后端请求的参数不是json字符串
  axios默认参数是json字符串发往后端
*/
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
// 封装了restful风格请求,post delete put get,export-暴露出去
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params
    })
}