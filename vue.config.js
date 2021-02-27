// 配置代理对象
let proxyObj = {};
proxyObj['/ws'] = {
    ws: true,
    target: 'ws://localhost:8088'
}

// 拦截http请求
proxyObj['/'] = {
    ws: false,
    // 目标转发地址，拦截到http请求转发到哪里去
    target: 'http://localhost:8088',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8089,
        proxy: proxyObj
    }
}