<template>
	<div class="wating-pay" ref="wpScroll">
		<div class="bill-content" >
			<back :text="text"></back>
			<div class="title">西可咖啡</div>
			<div class="dish">
				<div class="dish-item" v-for="food in orderData.order.dish">
					<div class="dish-name">{{food.name}}</div>
					<div class="dish-count"><i>&times;</i>{{food.count}}</div>
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
					<div class="dish-name">订单号： <span>seek02_12344389475894379483</span></div>
				</div>
			</div>
			<div class="other">
				<div class="dish-item">
					<div class="dish-name">支付方式： <span>在线支付</span></div>
				</div>
			</div>
			<div class="other">
				<div class="dish-item">
					<div class="dish-name">下单时间： <span>2017-1-5 12:30</span></div>
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
  					<router-link class="pay" to="/pay">去支付</router-link>
  				</div>
  			</div>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import split from 'components/split/split'
import back from 'components/back/back'

export default {
	data() {
		return {
			orderData: JSON.parse(window.localStorage.getItem('bill')),
			text: '等待支付'
		}
	},
	computed: {
		totalPrice() {
			let total = 0
			this.orderData.order.dish.forEach((food) => {
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
		})
	},
	methods: {
		cancel() {
			window.localStorage.removeItem('bill')
		},
		pay() {
			console.log('1')
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
	.wating-pay {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 60;
		width: 100%;
		height: 100%;
		background-color: #fff;
		.bill-content{
			padding-bottom: 48px;
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
				}
			}

		}

	}
</style>
















