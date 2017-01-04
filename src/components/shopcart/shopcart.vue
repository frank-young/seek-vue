<template>
   	<div>
   		<div class="shopcart">
	  		<div class="content" @click="toggleList">
	  			<div class="content-left">
	  				<div class="logo-wrap">
	  					<div class="logo" :class="{'highlight': totalCount>0}">
	  						<i class="icon-shopping_cart"></i>
	  					</div>
	  					<div class="num" v-show="totalCount>0">
	  						{{totalCount}}
	  					</div>
	  				</div>
	  				<div class="price" :class="{'highlight': totalPrice>0}">
	  					¥{{totalPrice}}
	  				</div>
	  				<div class="desc">
	  					<!-- 另需配送费¥{{deliveryPrice}} 元 -->
	  				</div>
	  			</div>
	  			<div class="content-right" @click.stop.prevent="pay">
	  				<div class="pay" :class="payClass">
	  					去结算
	  				</div>
	  			</div>
	  		</div>
	  		<transition name="fold">
	  			<div class="shopcart-list" v-show="listShow">
		  			<div class="list-header">
		  				<h1 class="title">购物车</h1>
		  				<span class="empty" @click="empty">清空</span>
		  			</div>
		  			<div class="list-content" ref="listContent">
		  				<ul>
		  					<li class="food" v-for="food in selectFoods">
		  						<span class="name">{{food.name}} </span>
		  						<div class="price">
		  							<span>
		  								¥{{food.price*food.count}}
		  							</span>
		  						</div>
		  						<div class="cartcontrol-wrap">
		  							<cartcontrol :food="food"></cartcontrol>
		  						</div>
		  					</li>
		  				</ul>
		  			</div>
		  		</div>
	  		</transition>
	  	</div>
	  	<transition name="fade">
	  		<div class="list-mask" v-show="listShow" @click="hideList"></div>
	  	</transition>
	  	<bill :foods="selectFoods" ref="bill"></bill>
   	</div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import bill from 'components/bill/bill'

export default {
	props: {
		selectFoods: {
			type: Array,
			default() {
				return [
					{
						price: 10,
						count: 1
					}
				]
			}
		},
		minPrice: {
			type: Number,
			default: 0
		},
		deliveryPrice: {
			type: Number,
			default: 0
		},
		domain: {
			type: String
		}
	},
	data() {
		return {
			fold: false
		}
	},
	created() {

	},
	computed: {
		totalPrice() {
			let total = 0
			this.selectFoods.forEach((food) => {
				total += food.price * food.count
			})
			return total
		},
		totalCount() {
			let count = 0
			this.selectFoods.forEach((food) => {
				count += food.count
			})
			return count
		},
		payDesc() {
			if (this.totalPrice === 0) {
				return `¥ ${this.minPrice}元起送`
			} else if (this.totalPrice < this.minPrice) {
				let diff = this.minPrice - this.totalPrice
				return `还差¥ ${diff}元起送`
			} else {
				return '去结算'
			}
		},
		payClass() {
			if (this.totalPrice < this.minPrice) {
				return 'not-enough'
			} else {
				return 'enough'
			}
		},
		listShow() {
			// 作为一个初始判断
			if (!this.totalCount) {
				this.fold = true
				return false
			}
			let show = !this.fold
			if (show) {
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.listContent, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				})
			}
			return show
		}
	},
	methods: {
		toggleList() {
			if (!this.totalCount) {
				return true
			}
			this.fold = !this.fold
		},
		empty() {
			this.selectFoods.forEach((food) => {
				food.count = 0
			})
		},
		hideList() {
			this.fold = true
		},
		pay() {
			if (this.totalPrice < this.minPrice) {
				return false
			}
			this.$refs.bill.show()
		}
	},
	components: {
		cartcontrol,
		bill
	}}
</script>

<style lang="less">
	@import '../../common/less/base.less';
	.c{
		color: rgba(255, 255, 255, 0.4);
	}
	.shopcart{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 48px;
		.content{
			display: flex;
			z-index: 2;
			.bg(#141d27);
			&-left{
				flex: 1;
				.logo-wrap{
					.pos(r);
					top: -10px;
					width: 56px;
					height: 56px;
					margin-left: 12px;
					float: left;
					.border-radius(50%);
					.bg(#141d27);
					.logo{
						.pos(a);
						top: 6px;
						left: 6px;
						width: 44px;
						height: 44px;
						.border-radius(50%);
						line-height: 48px;
						font-size: 24px;
						.ta(c);
						.bg(rgba(255, 255, 255,0.2));
						.c;
						&.highlight{
							.bg(rgb(0,160,220));
							color: @gf;
						}					
					}
					.num{
						.pos(a);
						top: 0;
						right: 0;
						width: 24px;
						height: 16px;
						line-height: 16px;
						.ta(c);
						.border-radius(16px);
						font-size: 9px;
						font-weight: 700;
						color: @gf;
						.bg(rgb(240,20,20));
						.box-shadow(0,4px,8px,rgba(0,0,0,0.4));
					}
				}
				.price{
					float: left;
					height: 48px;
					margin-left: 18px;
					padding-right: 12px;
					font-size: 16px;
					line-height: 48px;
					.c;
					font-weight: 700;
					&.highlight{
						color: @gf;
					}
				}
				.desc{
					position: relative;
					float: left;
					height: 48px;
					padding-left: 12px;
					font-size: 12px;
					.c;
					line-height: 48px;
					&:before{
						content: '';
						position: absolute;
						left: 0;
						top: 12px;
						width: 1px;
						height: 24px;
						.bg(rgba(255, 255, 255, 0.1))
					}
				}
			}
			&-right{
				flex:0 0 105px;
				width: 105px;
				.pay{
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 15px;
					font-weight: 700;
					.bg(rgba(255, 255, 255,0.2));
					.c;
					&.not-enough{
						.bg(#2b333b);
					}
					&.enough{
						.bg(#4cda64);
						color: @gf;
					}
				}
			}
		}
		.shopcart-list{
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			transform: translate3D(0,-100%,0);
			&.fold-enter-active, &.fold-leave-active{
				transform: translate3D(0,-100%,0);
				transition: all .3s;
			}
			&.fold-enter, &.fold-leave-active{
				transform: translate3D(0,0,0);
			}
			.list-header{
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background-color: #f3f5f7;
				border-bottom: 1px solid rgba(7, 17, 27, 0.1);
				.cls();
				.title{
					float: left;
					font-size: 14px;
					color: rgb(7,17,27);
				}
				.empty{
					float: right;
					font-size: 12px;
					color: rgb(0, 160, 220);
				}

			}
			.list-content{
				padding: 0 18px;
				max-height: 217px;
				overflow: hidden;
				background-color: #fff;
				.food{
					position: relative;
					padding: 12px 0;
					.box-sizing();
					.border-1px;
					.name{
						line-height: 24px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.price{
						position: absolute;
						right: 100px;
						bottom: 13px;
						line-height: 24px;
						font-size: 15px;
						color: rgb(240,20,20);
						span{
							font-weight: 700;
						}
					}
					.cartcontrol-wrap{
						position: absolute;
						right: 0;
						bottom: 6px;
					}
				}
			}
		}
	}
	.list-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
		background-color: rgba(7, 17, 27, 0.6);
		&.fade-enter-active, &.fade-leave-active{
			transition: all .3s;
			background-color: rgba(7, 17, 27, 0.6);
		}
		&.fade-enter, &.fade-leave-active{
			background-color: rgba(7, 17, 27, 0);
		}
	}
</style>


















