// 配置代理对象
let proxyObj = {};

// 拦截http请求
proxyObj['/'] = {
    ws: false,
    // 目标转发地址，拦截到http请求转发到哪里去
    target: 'http://localhost:8082',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8083,
        proxy: proxyObj
    }
}