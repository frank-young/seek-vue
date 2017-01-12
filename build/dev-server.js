require('./check-versions')()
var YunPianSDK = require('yunpian-nodejs')
var bodyParser = require('body-parser')
var connect = require('connect')
var mongoose = require('mongoose')
var request = require('request')
var WXPay = require('weixin-pay')
// var Alidayuapp = require('alidayu-node')
// var alidayuapp = new Alidayuapp('App Key', 'App Secret')
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser')
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
var dbUrl = 'mongodb://127.0.0.1/seekdb'
var Table = require('./models/table/table')

mongoose.connect(dbUrl)

var app = express()

app.set('views','./build/views/pages')  //设置视图根目录
app.set('view engine','jade') //设置默认的模板引擎

app.use(bodyParser.urlencoded({extended: true}))  //这里转换后才能使用  req.body里的内容
app.use(bodyParser.json())

app.set('trust proxy', 1)

app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys:['key1','key2'],
    maxAge: 20 * 60 * 1000
}))

var wxpay = WXPay({
  appid: 'wx782db8ee3e80c4aa',
  mch_id: '1295261101',
  partner_key: 'seekbrandseekcafe521521521521521'
})

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

apiRoutes.post('/code/send',function(req,res){
  let r = new YunPianSDK()
  let apikey = '4ed82bab99b0b150113955ae56fcb276'
  let mobile = req.body.phone
  let text = '【西可咖啡】您的验证码是'

  r.apikey = apikey
  r.mobile = mobile
  r.text = text
  if(!req.cookies.isSend){
    let re = r.sendMsg()
    re.then(function(value) {
      res.cookie('isSend', 1, {maxAge: 60 * 1000})
      req.session.mobile = value.result.mobile
      req.session.code = value.result.VCODE
      res.json({
        errno: 0,
        msg:'发送成功'
      })
    }, function(error) {
      console.log('失败')
    })
  } else {
    res.json({
      errno: 500,
      msg:'不能在1分钟内重复发送'
    })
  }
})

apiRoutes.post('/code/verify',function(req,res){
  let codeInput = req.body.code
  let phoneInput = req.body.phone
  let code = req.session.code
  let mobile = req.session.mobile
  if (codeInput === code && phoneInput === mobile) {
    res.json({
      errno:0,
      msg: '验证成功',
      phone: mobile
    })
  } else {
    res.json({
      errno:500,
      msg: '验证码错误'
    })
  }
})

apiRoutes.get('/table/:id',function(req,res){
  var id = req.params.id
  var appid = 'wx782db8ee3e80c4aa'
  var appSecret = '07edc09a46dba2e8d0b1964b5aec3a46'
  //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx782db8ee3e80c4aa&redirect_uri=http%3A%2F%2Ffrank.d1.natapp.cc%2Fmobile%2Fordering%2F58512475bfefa61c583e3132&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect

  var code = req.query.code
  // 用获取code换取token
  var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + appSecret + '&code=' + code + '&grant_type=authorization_code'
  var saveToken = function() {
      request(url, function(error, response, body) {
          if (!error && response.statusCode == 200) {
              var data = JSON.parse(body)
              var token = data.access_token
              var refresh_token = data.refresh_token
              var openid = data.openid

              req.session.openid = openid
              Table.findById(id, function(err, table) {
                  if (table) {
                      res.render('wxorder', {
                          status: 1,
                          num: table.num,
                          domain: table.domainlocal,
                          openid: openid
                      })
                  } else {
                      res.json({
                          status: 0,
                          msg: '扫描失败，请重新扫描二维码！'
                      })
                  }
              })

          } else {
              res.json({
                  status: 0,
                  msg: '已经授权过了'
              })

          }
      })
  }
  saveToken()
})

apiRoutes.get('/wxpay',function(req,res){
  console.log('调用了支付签名')
  let openid = req.query.openid
  let ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
  wxpay.getBrandWCPayRequestParams({
      openid: openid,
      body: '西可咖啡微信点餐',
      detail: '西可咖啡微信点餐',
      out_trade_no: '20170101'+Math.random().toString().substr(2, 10),
      total_fee: 1,
      spbill_create_ip: ip,
      notify_url: 'http://frank.d1.natapp.cc/api/notify'
  }, function(err, result){
      res.json({
          status: 1,
          data: result
      })
  })

})

apiRoutes.get('/notify',function(req,res){
  console.log('请求了回掉')
  res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code> <return_msg><![CDATA[OK]]>')
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
// app.use(staticPath, express.static('./static'))
app.use(express.static(path.join(__dirname,'../static')))

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
