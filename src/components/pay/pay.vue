<template>
	<transition name="move">
		<div class="bill">
			<div class="bill-content" >
				<back :text="text"></back>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">订单名称</div>
						<div class="dish-other"><span>西可咖啡微信点餐</span></div>
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
						<div class="pay-other"><span class="ico-check" v-show="payTypeShow"></span></div>
					</div>
				</div>
				<div class="other">
					<div class="dish-item select-radio" @click="memberPay">
						<div class="dish-name"><i class="icon-member"></i>会员卡支付</div>
						<div class="pay-other"><span class="ico-check" v-show="!payTypeShow"></span></div>
					</div>
				</div>
			</div>
			<div class="foot">
				<div class="foot-center" @click.stop.prevent="pay">
	  				<div class="pay">
	  					确认支付
	  				</div>
	  			</div>
			</div>
		</div>
	</transition>
</template>

<script>
import split from 'components/split/split'
import back from 'components/back/back'

const HOST = 'http://127.0.0.1:3000'
const STATUS = 1

export default {
	data() {
		return {
			orderData: JSON.parse(window.localStorage.getItem('bill')),
			text: '在线支付',
			payTypeShow: true,
			payType: 1
		}
	},
	computed: {
		totalPrice() {
			let p = Number(this.orderData.order.realTotal)
			return p.toFixed(2)
		}
	},
	methods: {
		wechatPay() {
			this.payTypeShow = !this.payTypeShow
			this.payType = 1
		},
		memberPay() {
			this.payTypeShow = !this.payTypeShow
			this.payType = 2
		},
		pay() {
			console.log(this.orderData.order.realTotal)
			this._pay()
		},
		_pay() {
			let options = {}

			options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
			options.emulateJSON = true

			console.log(this.domain)
			this.$http.post(HOST + '/api/order', this.orderData, options).then((res) => {
				res = res.body
				if (res.status === STATUS) {
					// console.log(res.msg)
				}
				console.log(res.msg)
			})
		}

	},
	components: {
		split,
		back
	}
}
</script>

<style lang="less">
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
	.sub-title{
		padding: 15px;
		font-size: 12px;
		color: #888;
		.b-1px();
	}
	.ico-check{
		display: block;
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
	.bill {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 60;
		width: 100%;
		height: 100%;
		background-color: #fff;
		&.move-enter-active, &.move-leave-active {
			transition: all .1s linear;
			transform: translate3D(0,0,0);
		}
		&.move-enter, &.move-leave-active {
			transform: translate3D(100%,0,0);
		}
		.bill-content{
			padding-bottom: 48px;
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
				flex: 1;
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
				flex: 0 0 100px;
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
		.foot{
			position: fixed;
			bottom: 0;
			left: 0;
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

	}
</style>
















