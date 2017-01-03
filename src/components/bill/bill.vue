<template>
	<transition name="move">
		<div v-show="showFlag" class="bill" ref="billScroll">
			<div class="back">
				<i class="icon-arrow_lift" @click="hidden"></i>
				<span class="back-txt">确认订单</span>
			</div>
			<div class="bill-content">
				<div class="title">西可咖啡</div>
				<div class="dish">
					<div class="dish-item" v-for="food in foods">
						<div class="dish-name">{{food.name}}</div>
						<div class="dish-count"><i>&times;</i>{{food.count}}</div>
						<div class="dish-price">¥{{food.price}} </div>
					</div>
					<div class="dish-item">
						<div class="dish-name"></div>
						<div class="dish-t-price"><span>待支付</span>¥{{totalPrice}}</div>
					</div>
				</div>
				<split></split>
			</div>
			<div class="foot">
				<div class="foot-left">
					<div class="foot-price">
						<span>待付款</span>¥{{totalPrice}}
					</div>
				</div>
				<div class="foot-right" @click.stop.prevent="pay">
	  				<div class="pay">
	  					提交订单
	  				</div>
	  			</div>
			</div>
		</div>
	</transition>
</template>

<script>
import BScroll from 'better-scroll'
import split from 'components/split/split'
import back from 'components/back/back'

export default {
	props: {
		foods: {
			type: Array
		}
	},
	data() {
		return {
			showFlag: false
		}
	},
	computed: {
		totalPrice() {
			let total = 0
			this.foods.forEach((food) => {
				total += food.price * food.count
			})
			return total
		}
	},
	methods: {
		show() {
			this.showFlag = true
			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.billScroll, {
						click: true
					})
				} else {
					this.scroll.refresh()
				}
			})
		},
		hidden() {
			this.showFlag = false
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
			margin-top: 48px;
		}
		.back{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 48px;
			line-height: 48px;
			background-color: #00a0dc;
			i{
				display: inline-block;
				font-size: 14px;
				padding: 10px 10px 10px 20px;
				margin-right: 10px;
				color: #fff;
			}
			.back-txt {
				font-size: 16px;
				color: #fff
			}
		}
		.bill-content{
			.title{
				padding: 15px;
				font-size: 15px;
				.b-1px();
			}
			.dish{
				.b-1px();
			}
			.dish-item{
				padding: 15px;
				font-size: 14px;
				display: flex;
			}
			.dish-name{
				flex: 1;
				color: #555;
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
				color: #333;
				span{
					color: #333;
					margin-right: 5px;
				}
			}
		}
		.foot{
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			width: 100%;
			height: 48px;
			background-color: #141d27;
			.foot-left{
				flex:1;
				line-height: 48px;
				margin-left: 20px;
				.foot-price{
					color: #fff;
					font-weight: 600;
					span{
						margin-right: 10px;
					}
				}
			}
			.foot-right{
				flex:0 0 105px;
				width: 105px;
				.pay{
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 15px;
					font-weight: 700;
					background-color: #00b43c;
					color: #fff;
				}
			}

		}

	}
</style>
















