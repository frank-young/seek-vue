var YunPianSDK = require('yunpian-nodejs')
var bodyParser = require('body-parser')
var connect = require('connect')
var mongoose = require('mongoose')
var request = require('request')
var WXPay = require('weixin-pay')
var xmlparser = require('express-xml-bodyparser')
var path = require('path')
var express = require('express')
var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser')
var webpack = require('webpack')
var dbUrl = 'mongodb://127.0.0.1/seekdb'
var Table = require('./build/models/table/table')
var Info = require('./build/models/info/info')
var config = require('./config/index')

var port = process.env.PORT || config.build.port

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
    keys: ['key1','key2'],
    maxAge: 20 * 60 * 1000
}))

var wxpay = WXPay({
  appid: 'wx782db8ee3e80c4aa',
  mch_id: '1295261101',
  partner_key: 'seekbrandseekcafe521521521521521'
})

var router = express.Router()

router.get('/',function(req, res, next){
  
  req.url = '/index.html'
  next()
})

app.use(router)

var apiRoutes = express.Router()

apiRoutes.post('/code/send',function(req,res){
  var r = new YunPianSDK()
  var apikey = '4ed82bab99b0b150113955ae56fcb276'
  var mobile = req.body.phone
  var text = '【西可咖啡】您的验证码是'

  r.apikey = apikey
  r.mobile = mobile
  r.text = text
  if(!req.cookies.isSend){
    var re = r.sendMsg()
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
  var codeInput = req.body.code
  var phoneInput = req.body.phone
  var code = req.session.code
  var mobile = req.session.mobile
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
              // if(mongoose.Types.ObjectId.isValid(id)){
              //   var _id = mongoose.Types.ObjectId(id);
              // } else {
              //   var _id = id
              // }
              
              Table.findOne({'_id': id}, function(err, table) {
                if (err) {
                  console.log(err)
                }
                console.log(table)
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
                        msg: '扫描失败，请重新扫描二维码'
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
  var openid = req.query.openid
  var orderNum = req.query.out_trade_no
  var total_fee = req.query.total_fee
  var ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
  wxpay.getBrandWCPayRequestParams({
      openid: openid,
      body: '西可咖啡微信点餐',
      detail: '西可咖啡微信点餐',
      out_trade_no: orderNum,
      total_fee: Number(total_fee * 100),
      spbill_create_ip: ip,
      notify_url: 'http://frank.d1.natapp.cc/api/notify'
  }, function(err, result){
      res.json({
          status: 1,
          data: result
      })
  })
})

apiRoutes.post('/notify',xmlparser({trim: false, explicitArray: false}),function(req,res){
  console.log('请求了回掉')
  var msg = req.body.xml
  var res_data = '<xml>'+
                    '<return_code><![CDATA[SUCCESS]]></return_code>'+
                    '<return_msg><![CDATA[OK]]></return_msg>'+
                  '</xml>'
  if (msg.result_code === 'SUCCESS') {
    var HOST = 'http://139.129.239.39:3000'
    console.log(msg.out_trade_no)
    Info.findOne({'orderNum': msg.out_trade_no},function(err,info){
      if(err){
        console.log(err)
      }
      var formdata = {
        order: info.order
      }

      var formdata_2 = {
          statusOrder: info.statusOrder
      }

      var options = {
          url: HOST + '/api/order',
          form: formdata,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
      var options_2 = {
          url: HOST + '/table/save/order',
          form: formdata_2,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      }

      request.post(options, function(error, response, body) {
          if (!error && response.statusCode == 200) {
              var data = JSON.parse(body)
              request.post(options_2, function(error, response, body) {
                  if (!error && response.statusCode == 200) {
                      var data = JSON.parse(body)
                      res.writeHead(200, { 'Content-Type': 'application/xml' })
                      res.end(res_data)
                  }
              })
          }
      })
    }) 
  }
})

apiRoutes.post('/save/order',function(req,res){
  var order = req.body.alldata.order
  var statusOrder = req.body.alldata.statusOrder
  var orderNum = req.body.alldata.order.order.orderNum

  var _info
    _info = new Info({
      order: order,
      statusOrder: statusOrder,
      orderNum:orderNum
    })
    _info.save(function(err,info){
      if(err){
        console.log(err)
      }
      res.json({msg:"添加成功",status: 1})
    })
})

app.use('/api',apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

})
