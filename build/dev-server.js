require('./check-versions')()
var request = require('request')
// var Alidayuapp = require('alidayu-node')
// var alidayuapp = new Alidayuapp('App Key', 'App Secret')
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
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

apiRoutes.get('/send/code',function(req,res){
  let api_key = '4ed82bab99b0b150113955ae56fcb276'
  let mobile = '18608164404'
  let text = '【西可咖啡】正在进行支付操作，您的验证码是#code#，如非本人操作，请忽略。'
  let callback_url = 'http://127.0.0.1:8080/send/code/callback'

  let url = 'https://sms.yunpian.com/v2/sms/single_send.json'

    var formdata = {
        "apikey": api_key,
        "mobile": mobile,
        "text": text,
        "callback_url": callback_url
        
    }

    var options = {
        url: url,
        form: JSON.stringify(formdata),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    console.log('send')
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log('success')
            var data = JSON.parse(body)
            res.json({
                msg: '1',
                data: data
            })
        }
    })
})

apiRoutes.get('/send/code/callback',function(req,res){
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
