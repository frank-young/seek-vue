<template>
	<div>
		<back :text="text"></back>
		<div class="wating-pay" ref="wpScroll">
			<div class="bill-content" >
				<div class="wating-tab">
					<div class="tab-panel">
						<div class="panel-icon">
							<i class="icon-money"></i>
						</div>
						<div class="panel-txt">
							<h3>等待支付</h3>
							<p>逾期未支付订单将自动取消</p>
						</div>
					</div>
				</div>
				<div class="title">西可咖啡</div>
				<div class="dish">
					<div class="dish-item" v-for="food in order.dish">
						<div class="dish-name">{{food.name}}</div>
						<div class="dish-count"><i>&times;</i>{{food.number}}</div>
						<div class="dish-price">¥{{food.price}} </div>
					</div>
				</div>
				<div class="dish">
					<div class="dish-item">
						<div class="dish-name"></div>
						<div class="dish-t-price"><span>合计</span>¥{{totalPrice}}</div>
					</div>
				</div>
				<split></split>
				<div class="title">订单详情</div>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">订单号： <span>{{order.orderNum}}</span></div>
					</div>
				</div>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">支付方式： <span>在线支付</span></div>
					</div>
				</div>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">下单时间： <span>{{order.time | date}}</span></div>
					</div>
				</div>
				<split></split>
			</div>
			<div class="wating-foot">
				<div class="foot-left" @click.stop.prevent="cancel">
					<div class="foot-price">
						取消订单
					</div>
				</div>
				<div class="foot-right" @click.stop.prevent="pay">
	  				<div class="pay">
	  					去支付<span>（还剩 <settimer :timer="timer" :vId="vId" ref="settimerfunc"></settimer>）</span>
	  				</div>
	  			</div>
			</div>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import split from 'components/split/split'
import back from 'components/back/back'
import settimer from 'components/settimer/settimer'
// import VueRouter from 'vue-router'

// const router = new VueRouter()

export default {
	data() {
		return {
			orders: JSON.parse(window.localStorage.getItem('orders')),
			order: null,
			vId: window.localStorage.getItem('vId'),
			text: '等待支付',
			timer: 0
		}
	},
	computed: {
		totalPrice() {
			let total = 0
			this.order.dish.forEach((food) => {
				total += Number(food.price * food.number)
			})
			return total.toFixed(2)
		}
	},
	created() {
		this.$nextTick(() => {
			this.scroll = new BScroll(this.$refs.wpScroll, {
				click: true
			})
			this.$refs.settimerfunc.starttimer()
		})
		this._setOrder()
		this.timer = Math.ceil((new Date(this.order.time) - 0) / 1000)
	},
	methods: {
		cancel() {
			this._cancelLocalOrdersData()
			this.$router.push({path: '/order'})
		},
		pay() {
			this.$router.push({name: 'pay'})
		},
		_setOrder() {
			this.orders.forEach((order) => {
				if (order.order.vId === this.vId) {
					this.order = order.order
				}
			})
		},
		_cancelLocalOrdersData() {
			this.orders.forEach((order) => {
				if (order.order.vId === this.vId) {
					order.order.wxpayType = 2
				}
			})
			this._saveLocalOrdersData()
		},
		_saveLocalOrdersData() {
			window.localStorage.setItem('orders', JSON.stringify(this.orders))
		}
	},
	components: {
		split,
		back,
		settimer
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
	.wating-pay {
		position: fixed;
		left: 0;
		top: 48px;
		bottom: 58px;
		z-index: 16;
		width: 100%;
		background-color: #f3f5f7;
		.bill-content{
			background-color: #fff;
			.wating-tab {
				padding: 10px;
				background-color: #3290e8;
			}
			.tab-panel {
				padding: 30px 20px;
				border-radius: 4px;
				background-color: #fff;
				display: flex;
				.panel-icon{
					flex: 0 0 50px;
					i{
						font-size: 35px;
						color: rgb(252, 97, 32);
					}
				}
				.panel-txt {
					flex: 1;
					h3{
						margin-bottom: 15px;
						font-size: 20px;
						line-height: 18px;
						font-weight: 600;
						color: rgb(252, 97, 32);
					}
					p{
						line-height: 14px;
						font-size: 14px;
						color: #555;
					}
				}
			}
			.title{
				padding: 15px;
				font-size: 15px;
				.b-1px();
			}
			.dish{
				.b-1px();
			}
			.other{
				.b-1px();
			}
			.dish-item{
				padding: 15px;
				font-size: 14px;
				display: flex;
				
			}
			.dish-name{
				flex: 1;
				color: #222;
			}
			.dish-count,
			.dish-price{
				flex: 0 0 50px;
				width: 50px;
				text-align: right;
			}
			.dish-count{
				color: #777;
				i{
					position: relative;
					font-style: normal;
					top: -1px;
				}
			}
			.dish-price{
				font-weight: normal;
				color: #333;
			}
			.dish-t-price{
				flex: 0 0 100px;
				width: 100px;
				text-align: right;
				font-weight: normal;
				color: #f60;
				span{
					color: #333;
					margin-right: 10px;
				}
			}
		}
		.wating-foot{
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			width: 100%;
			height: 62px;
			border-top: 1px solid #cdcdcd;
			background-color: #fff;
			.foot-left{
				flex:0 0 115px;
				padding: 8px 15px;
				box-sizing: border-box;
				.foot-price{
					height: 44px;
					line-height: 44px;
					text-align: center;
					color: #666;
					border: 1px solid #cdcdcd;
					border-radius: 2px;
					font-size: 16px;
				}
			}
			.foot-right{
				flex: 1;
				padding: 8px 15px 8px 0;
				.pay{
					height: 46px;
					line-height: 46px;
					text-align: center;
					font-size: 16px;
					font-weight: 700;
					border-radius: 2px;
					background-color: rgb(252, 97, 32);
					color: #fff;
					span{
						font-size: 15px;
					}
				}
			}

		}

	}
</style>
















