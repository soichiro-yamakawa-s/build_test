const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy.createProxyMiddleware('/common', {
      target: 'http://172.30.0.57:8080/qrlab',
      changeOrigin: true,
    }),
  )
}