// // src/setupProxy.js
// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//   app.use(
//     '/v1/esignet/oauth/v2/token',
//     createProxyMiddleware({
//       target: 'https://esignet.ida.fayda.et',
//       changeOrigin: true,
//     })
//   );
// };