<template>
   <div class="shopcart">
  		<div class="content">
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
  					另需配送费¥{{deliveryPrice}} 元
  				</div>
  			</div>
  			<div class="content-right">
  				<div class="pay" :class="payClass">
  					{{payDesc}}
  				</div>
  			</div>
  		</div>
  	</div>
</template>

<script>
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
		}
	},
	data () {
		return {
			price: 0
		}
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
		}
	}
}
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
		z-index: 20;
		width: 100%;
		height: 48px;
		.content{
			display: flex;
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
					font-size: 12px;
					font-weight: 700;
					.bg(rgba(255, 255, 255,0.2));
					.c;
					&.not-enough{
						.bg(#2b333b);
					}
					&.enough{
						.bg(#00b43c);
						color: @gf;
					}
				}
			}
		}
	}
</style>


















