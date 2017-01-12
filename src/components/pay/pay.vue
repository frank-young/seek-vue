<template>
	<div class="pay-container">
		<div class="success-close">
			<i class="icon-close" @click="close"></i>
			<span class="close-txt">{{text}}</span>
		</div>
		<div class="pay-wrap" ref="payScroll">
			<div class="bill-content" >
				<div class="timer">
					支付剩余时间：<span>{{timer}}</span>
				</div>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">订单名称</div>
						<div class="dish-other"><span>西可咖啡微信点餐</span></div>
					</div>
				</div>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">订单编号</div>
						<div class="dish-other"><span>{{order.order.orderNum}}</span></div>
					</div>
				</div>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">支付金额</div>
						<div class="pay-price">¥{{totalPrice}}</div>
					</div>
				</div>
				<split></split>
				<div class="sub-title">请选择支付方式</div>
				<div class="other">
					<div class="dish-item select-radio" @click="wechatPay">
						<div class="dish-name"><i class="icon-wechat"></i>微信支付</div>
						<div class="pay-price"><span class="ico-check" v-show="payTypeShow"></span></div>
					</div>
				</div>
				<div class="other">
					<div class="dish-item select-radio" @click="memberPay">
						<div class="dish-name"><i class="icon-member"></i>会员卡支付</div>
						<div class="pay-price"><span class="ico-check" v-show="!payTypeShow"></span></div>
					</div>
					<sendcode ref="code"></sendcode>
				</div>
				<split></split>
			</div>
		</div>
		<alertmsg :text="alertmsg" ref="alertmsg"></alertmsg>
		<div class="foot">
			<div class="foot-center" @click.stop.prevent="pay">
  				<div class="pay">
  					确认支付
  				</div>
  			</div>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import split from 'components/split/split'
import back from 'components/back/back'
import sendcode from 'components/sendcode/sendcode'
import alertmsg from 'components/alertmsg/alertmsg'
// import VueRouter from 'vue-router'

// const router = new VueRouter()
const wx = require('weixin-js-sdk')
const HOST = 'http://192.168.31.217:3000'
const HOST_LOCAL = 'http://frank.d1.natapp.cc'
const STATUS = 1
const ERRNO_OK = 0

export default {
	data() {
		return {
			orders: JSON.parse(window.localStorage.getItem('orders')),
			order: null,
			vId: window.localStorage.getItem('vId'),
			text: '在线支付',
			payTypeShow: true,
			payType: 1,
			timer: 30,
			stop: false,
			Interval: null,
			alertmsg: '付款成功',
			wxpayData: {},
			openid: window.localStorage.getItem('openid')
		}
	},
	computed: {
		totalPrice() {
			let p = Number(this.order.order.realTotal)
			return p.toFixed(2)
		}
	},
	created() {
		this._setOrder()
		this.$nextTick(() => {
			this.scroll = new BScroll(this.$refs.payScroll, {
				click: true
			})
		})
	},
	methods: {
		close() {
			this.$router.push({name: 'order'})
		},
		update() {
			if (this.timer <= 0) {
				this.timer = 30
			} else {
				this.timer--
			}
		},
        startTimer() {
			if (this.stop === false) {
				console.log('start')
				this.Interval = setInterval(this.update, 1000)
			} else {
				clearInterval(this.Interval)
			}
			this.stop = !this.stop
        },
		wechatPay() {
			this.payTypeShow = true
			this.payType = 1
			this.$refs.code.hide()
		},
		memberPay() {
			this.payTypeShow = false
			this.payType = 2
			this.$refs.code.show()
		},
		pay() {
			if (this.payType === 1) {
				console.log('微信支付')
				// this._targetToSuccess()
				this._getWxpayData()
			} else if (this.payType === 2) {
				this.$refs.code.verify((res) => {
					res = res.body
					if (res.errno === ERRNO_OK) {
						// this._pay()
						this._reduceMoney(res.phone)
					}
					console.log(res.msg)
				})
			}
		},
		_pay() {
			let options = {}

			options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
			options.emulateJSON = true

			this.$http.post(HOST + '/api/order', this.order, options).then((res) => {
				res = res.body
				if (res.status === STATUS) {
				}
			})
		},
		_reduceMoney(phone) {
			let options = {}
			let data = {
				'petcard': {
					'domain': this.order.domain,
					'total_fee': this.order.order.realTotal,
					'int': 0,
					'phone': phone
				}
			}

			options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
			options.emulateJSON = true

			this.$http.post(HOST + '/petcard/reduce/wechat', data, options).then((res) => {
				res = res.body
				if (res.status === STATUS) {
					this._targetToSuccess()
				}
			})
		},
		_setOrder() {
			this.orders.forEach((order) => {
				if (order.order.vId === this.vId) {
					this.order = order
				}
			})
		},
		_targetToSuccess() {
			this._setLocalOrdersData()
			this.$refs.alertmsg.show()
			this.$router.push({name: 'success'})
		},
		_setLocalOrdersData() {
			this.orders.forEach((order) => {
				if (order.order.vId === this.vId) {
					order.order.wxpayType = 1
				}
			})
			this._saveLocalOrdersData()
		},
		_saveLocalOrdersData() {
			window.localStorage.setItem('orders', JSON.stringify(this.orders))
		},
		_getWxpayData() {
			this.$http.get(HOST_LOCAL + '/api/wxpay?openid=' + this.openid).then((res) => {
				res = res.body
				if (res.status === STATUS) {
					this.wxpayData = res.data
					this._wxpayConfig()
					wx.ready(() => {
						this._setWxpayInfo(res.data)
					})
				}
			})
		},
		_wxpayConfig() {
			this.$http.get(HOST + '/api/signa').then((res) => {
				let data = res.body.data
				if (res.body.status === STATUS) {
					wx.config({
						debug: true,
						appId: data.appId,
						timestamp: data.timestamp,
						nonceStr: data.nonceStr,
						signature: data.signature,
						jsApiList: ['chooseWXPay']
					})
				}
			})
		},
		_setWxpayInfo(data) {
			wx.chooseWXPay({
				appId: data.appId,
				timestamp: data.timeStamp,
				nonceStr: data.nonceStr,
				package: data.package,
				signType: data.signType,
				paySign: data.paySign,
				success(res) {
					if (res.errMsg === 'chooseWXPay:ok') {
						window.alert(res)
						// this.$options.methods._setLocalOrdersData.bind(this)()
						// router.push('success')
					} else {
						window.alert('失败！！！')
					}
				},
				cancel() {
					window.alert('取消！！！')
				},
				error(res) {
					window.alert('失败！！！')
				}
			})
		}
	},
	components: {
		split,
		back,
		sendcode,
		alertmsg
	}
}
</script>

<style lang="less">
	.pay-container{
	    position: fixed;
	    left: 0;
	    top: 0;
	    z-index: 16;
    	width: 100%;
		height: 100%;
		background-color: #f3f5f7;
	}
	.b-1px(@x:rgba(0,0,0,.1)){
		position: relative;
		&:after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: @x;
			transform: scale(1,.5);
		}
	}
	.timer{
		height: 26px;
		line-height: 26px;
		text-align: center;
		background-color: #fffeec;
		border-bottom: 1px solid #e8e5e0;
		color: #f60;
		font-size: 12px;
		span{
			color: #f60;
		}
	}
	.sub-title{
		padding: 15px;
		font-size: 12px;
		color: #888;
		.b-1px();
	}
	.ico-check{
		display: inline-block;
		width: 23px;
		height: 23px;
		border-radius: 50%;
		background-color: rgb(31,185,34);
		position: relative;
		&:after{
			content: '';
			position: absolute;
			top: 4px;
			left: 5px;
			width: 15px;
			height: 6px;
			border-left: 3px solid #fff;
			border-bottom: 3px solid #fff;
			transform: rotate(-45deg);

		}
	}
	.success-close{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 20;
		width: 100%;
		height: 48px;
		line-height: 48px;
		background-color: #3290e8;
		i{
			display: inline-block;
			font-size: 24px;
			padding: 12px 10px 12px 20px;
			margin-right: 10px;
			color: #fff;
		}
		.close-txt {
			display: inline-block;
			vertical-align: top;
			font-size: 16px;
			color: #fff
		}	
	}
	.pay-wrap {
		position: fixed;
		left: 0;
		top: 48px;
		bottom: 220px;
		z-index: 16;
		width: 100%;
		background-color: #f3f5f7;
		.bill-content{
			background-color: #fff;
			.other{
				.b-1px();
			}
			.dish-item{
				padding: 15px;
				font-size: 14px;
				display: flex;
				position: relative;
			}
			.dish-name{
				flex: 0 0 140px;
				color: #222;
				i{
					font-size: 30px;
					vertical-align: middle;
					margin-right: 10px;
				}
				.icon-wechat{
					color: rgb(31,185,34);
				}
				.icon-member{
					color: #3290e8;
				}
			}
			.dish-other,
			.pay-price{
				flex: 1;
				width: 100px;
				text-align: right;
				span{
					font-weight: normal;
					color: #666;
					font-size: 12px;
				}
				
			}
			.pay-price{
				color: #f60;
				font-size: 16px;
				font-weight: normal;
			}
		}

	}
	.foot{
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 20;
			width: 100%;
			height: 48px;
			.foot-center{
				width: 100%;
				.pay{
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 15px;
					font-weight: 700;
					background-color: #4cda64;
					color: #fff;
				}
			}

		}
</style>
















