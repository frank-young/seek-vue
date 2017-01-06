require('./check-versions')()
var YunPianSDK = require('yunpian-nodejs')
// var Alidayuapp = require('alidayu-node')
// var alidayuapp = new Alidayuapp('App Key', 'App Secret')
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var cookieSession = require('cookie-session')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable


var app = express()

app.set('trust proxy', 1)

app.use(cookieSession({
    name: 'session',
    keys:['key1','key2'],
    maxAge: 24 * 60 * 60 * 1000
}))

var appData = require('../data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRoutes = express.Router()

apiRoutes.get('/seller',function(req,res){
  res.json({
    errno:0,
    data:seller
  })
})

apiRoutes.get('/goods',function(req,res){
  res.json({
    errno:0,
    data:goods
  })
})

apiRoutes.get('/ratings',function(req,res){
  res.json({
    errno:0,
    data:ratings
  })
})

apiRoutes.get('/code/send',function(req,res){
  let r = new YunPianSDK()
  let apikey = '4ed82bab99b0b150113955ae56fcb276'
  let mobile = '18608164404'
  let text = '【西可咖啡】您的验证码是'
  console.log(req.session.code)
  r.apikey = apikey
  r.mobile = mobile
  r.text = text
  let re = r.sendMsg()
  re.then(function(value) {
      req.session.code = value.result.VCODE
      console.log(req.session.code)
  }, function(error) {
      console.log('失败')
  })
})

apiRoutes.get('/code/verify',function(req,res){
  let code = req.session.code
  res.json({
    errno:0,
    code:code
  })
})

apiRoutes.get('/code/callback',function(req,res){
  res.json({
    errno:0,
    data:res
  })
})


app.use('/api',apiRoutes)

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
