<template>
	<div class="order" ref="orderScroll">
		<div>
			<back :text="text"></back>
			<div class="order-no" v-show="!orders">
				没有订单，请去点餐...
			</div>
			<div class="order-item" v-for="order in orders" @click="orderDetail(order.order.vId, order.order.wxpayType, $event)">
				<div class="item-con">
					<div class="con-text">
						<h3>西可咖啡</h3>
						<p>{{order.order.time | date}}</p>
					</div>
					<div class="con-status" v-html="payType(order.order.wxpayType)">
					</div>
				</div>
				<div class="item-des">
					<div class="des-text">
						{{order.order.dish[0].name}}
					</div>
					<div class="des-total">
						¥{{order.order.realTotal | currency}}
					</div>
				</div>
				<split></split>
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
			orders: JSON.parse(window.localStorage.getItem('orders')),
			text: '订单'
		}
	},
	computed: {
		// totalPrice() {
		// 	let total = 0
		// 	this.orderData.order.dish.forEach((food) => {
		// 		total += Number(food.price * food.number)
		// 	})
		// 	return total.toFixed(2)
		// }
	},
	created() {
		this.$nextTick(() => {
			this.scroll = new BScroll(this.$refs.orderScroll, {
				click: true
			})
		})
	},
	methods: {
		payType(value) {
			let text = null
			switch (value) {
				case 0:
					text = '<span class="red">未支付</span>'
					break
				case 1:
					text = '<span class="green">订单完成</span>'
					break
				case 2:
					text = '<span class="gray">订单取消</span>'
					break
			}
			return text
		},
		orderDetail(id, type, event) {
			if (!event._constructed) {
				return true
			}
			if (type === 0) {
				this.$router.push({name: 'watingpay', params: {id: id}})
			} else if (type === 1) {
				this.$router.push({name: 'orderdetail', params: {id: id}})
			} else {
				this.$router.push({name: 'ordercancel', params: {id: id}})
			}
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
	.order {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 60;
		width: 100%;
		height: 100%;
		background-color: #f3f5f7;
		.order-no {
			font-size: 16px;
			text-align: center;
			padding: 30px;
		}
		.order-item {
			background-color: #fff;
			.item-con {
				display: flex;
				justify-content: space-between;
				padding: 15px 15px 10px 15px;
				.b-1px();
				.con-text {
					h3 {
						margin-bottom: 8px;
						font-size: 16px;
						color: #333;
						font-weight: normal;
					}
					p {
						font-size: 12px;
						color: #444;
					}
				}
				.con-status {
					font-size: 14px;
					font-weight: normal;
					color: #333;
				}
			}
			.item-des {
				display: flex;
				justify-content: space-between;
				padding: 15px;
				.des-text {
					font-size: 14px;
					color: #555;
				}
				.des-total {
					font-size: 16px;
					color: #222;
					font-weight: normal;
				}
			}	
		}
		.red {
			color: #f01414;
		}
		.green {
			color: #3dba84;
		}
		.gray {
			color: #afafaf;
		}
	}
</style>
















