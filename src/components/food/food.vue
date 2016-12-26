<template>
	<transition name="move">
		<div v-show="showFlag" class="food" ref="foodScroll">
			<div class="food-content">
				<div class="img-header">
					<img src="" alt="" :src="food.image">
					<div class="back" @click="hidden">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份 </span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">¥{{food.price}} </span>
						<span class="old" v-show="food.oldPrice">
							¥{{food.oldPrice}}
						</span>
					</div>
					<div class="cartcontrol-wrap">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">
						加入购物车
					</div>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="ratings">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'

// const POSITIVE = 0
// const NAGATIVE = 1
const ALL = 2

export default {
	props: {
		food: {
			type: Object
		}
	},
	data() {
		return {
			showFlag: false,
			selectType: ALL,
			onlyContent: true,
			desc: {
				all: '全部',
				positive: '推荐',
				nagative: '吐槽'
			}
		}
	},
	methods: {
		show() {
			this.showFlag = true
			this.selectType = ALL
			this.onlyContent = true
			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.foodScroll, {
						click: true
					})
				} else {
					this.scroll.refresh()
				}
			})
		},
		hidden() {
			this.showFlag = false
		},
		addFirst(event) {
			if (!event._constructed) {
				return true
			}
			Vue.set(this.food, 'count', 1)
		}
	},
	components: {
		cartcontrol,
		split,
		ratingselect
	}
}
</script>

<style lang="less">
	.food {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
		z-index: 30;
		width: 100%;
		background-color: #fff;
		&.move-enter-active, &.move-leave-active {
			transition: all .2s linear;
			transform: translate3D(0,0,0);
		}
		&.move-enter, &.move-leave-active {
			transform: translate3D(100%,0,0);
		}
		.food-content{
			.img-header{
				position: relative;
				width: 100%;
				height: 0;
				padding-top: 100%;
				img{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
				.back{
					position: absolute;
					top: 10px;
					left: 0;
					i{
						display: block;
						padding: 10px;
						font-size: 20px;
						color: #fff;
					}
				}
			}
			.content{
				position: relative;
				padding: 18px;
				.title{
					line-height: 14px;
					margin-bottom: 8px;
					font-size: 14px;
					font-weight: 700;
					color: rgb(7, 17, 27);
				}
				.detail {
					height: 10px;
					margin-bottom: 18px;
					line-height: 10px;
					font-size: 0;
					.sell-count,.rating{
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.sell-count {
						margin-right: 12px;
					}
				}
				.price{
					line-height: 24px;
					.now{
						font-weight: 700;
						margin-right: 8px;
						font-size: 14px;
						color: rgb(240, 20, 20);
					}
					.old{
						font-weight: 700;
						font-size: 10px;
						color: rgb(147,153,159);
						text-decoration: line-through;
					}
				}
			}
			.cartcontrol-wrap{
				position: absolute;
				right: 12px;
				bottom: 12px;

			}
			.buy{
				position: absolute;
				right: 18px;
				bottom: 16px;
				z-index: 10;
				height: 28px;
				line-height: 28px;
				padding: 0 12px;
				box-sizing: border-box;
				font-size: 10px;
				border-radius: 14px;
				color: #fff;
				background-color: rgb(0, 160, 220)
			}
			.info{
				padding: 18px;
				.title{
					line-height: 14px;
					margin-bottom: 6px;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.text{
					color: rgb(77, 85, 93);
					line-height: 24px;
					padding: 0 8px;
					font-size: 12px;
				}

			}
			.ratings{
				padding-top: 18px;
				.title{
					line-height: 14px;
					margin-left: 18px;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
			}
		}

	}
</style>
















