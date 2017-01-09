<template>
	<div class="order-detail" ref="odScroll">
		<div class="order-content" >
			<back :text="text"></back>
			<div class="order-tab">
				<div class="tab-panel">
					<div class="panel-icon">
						<i class="icon-checked"></i>
					</div>
					<div class="panel-txt">
						<h3>订单已完成</h3>
						<p>如有疑问，请咨询服务员。</p>
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
					<div class="dish-t-price"><span>实付</span>¥{{totalPrice}}</div>
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
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import split from 'components/split/split'
import back from 'components/back/back'

export default {
	data() {
		return {
			orders: JSON.parse(window.localStorage.getItem('orders')),
			order: null,
			text: '订单完成'
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
			this.scroll = new BScroll(this.$refs.odScroll, {
				click: true
			})
		})
		this._setOrder()
	},
	methods: {
		_setOrder() {
			this.orders.forEach((order) => {
				if (order.order.vId === this.$route.params.id) {
					this.order = order.order
				}
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
	.order-detail {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 10;
		width: 100%;
		height: 100%;
		background-color: #f3f5f7;
		.order-content{
			background-color: #fff;
			.order-tab {
				padding: 10px;
				background-color: #3290e8;
			}
			.tab-panel {
				padding: 30px 20px;
				border-radius: 4px;
				background-color: #fff;
				display: flex;
				.panel-icon{
					flex: 0 0 80px;
					text-align: center;
					i{
						font-size: 35px;
						color: #1d953f;
					}
				}
				.panel-txt {
					flex: 1;
					h3{
						margin-bottom: 15px;
						font-size: 20px;
						line-height: 18px;
						font-weight: 600;
						color: #1d953f;
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

	}
</style>
















