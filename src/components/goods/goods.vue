<template>
  	<div class="goods">
  		<div class="menu-wrap" ref="menuWrap">
  			<ul>
  				<li v-for="(item,index) in goods" class="menu-item" v-bind:class="{'active':currentIndex === index}" @click="selectMenu(index,$event)">
  					<span class="text">
  						<span v-show="item.type>0" class="icon" v-bind:class="classMap[item.type]"></span> {{item.name}}
  					</span>
  				</li>
  			</ul>
  		</div>
  		<div class="foods-wrap" ref="foodWrap">
  			<ul>
  				<li v-for="item in goods" class="food-list food-list-hook">
  					<h2 class="title">{{item.name}} </h2>
  					<ul>
  						<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
  							<div class="icon"><img :src="food.icon" alt=""></div>
  							<div class="content">
  								<h3 class="name">{{food.name}}</h3>
  								<p class="desc">{{food.description}}</p>
  								<div class="extra">
  									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}% </span>
  								</div>
  								<div class="price">
  									<span class="now">¥{{food.price}} </span><span class="old" v-show="food.oldPrice">
  										¥{{food.oldPrice}}
  									</span>
  								</div>
  								<div class="cartcontrol-wrap">
  									<cartcontrol :food="food"></cartcontrol>
  								</div>
  							</div>
  						</li>
  					</ul>
  				</li>
  			</ul>
  		</div>
  		<shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="minPrice" :domain="domain"></shopcart>
  		<food :food="selectedFood" ref="food"></food>
  	</div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'

const ERR_OK = 0
// const HOST = 'http://127.0.0.1:3000'

export default {
	props: {
		seller: {
			type: Object
		},
		minPrice: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			domain: decodeURI(this._getQueryString('domain')),
			selectedFood: {}
		}
	},
	computed: {
		currentIndex() {
			for (let i = 0; i < this.listHeight.length; i++) {
				let height1 = this.listHeight[i]
				let height2 = this.listHeight[i + 1]
				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i
				}
			}
			return 0
		},
		selectFoods() {
			let foods = []
			this.goods.forEach((good) => {
				good.foods.forEach((food) => {
					// 如果food有count
					if (food.count) {
						foods.push(food)
					}
				})
			})
			return foods
		}
	},
	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
		this.$http.get('/api/goods').then((res) => {
			res = res.body
            if (res.errno === ERR_OK) {
                this.goods = res.data
                this.$nextTick(() => {
					this._initScroll()
					this._calculateHeight()
                })
            }
		})
	},
	methods: {
		_initScroll() {
			this.menuScroll = new BScroll(this.$refs.menuWrap, {
				click: true
			})
			this.foodsScroll = new BScroll(this.$refs.foodWrap, {
				click: true,
				probeType: 3
			})
			this.foodsScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y))
			})
		},
		_calculateHeight() {
			let foodList = this.$refs.foodWrap.getElementsByClassName('food-list-hook')
			let height = 0
			this.listHeight.push(height)
			for (let i = 0; i < foodList.length; i++) {
				let item = foodList[i]
				height += item.clientHeight
				this.listHeight.push(height)
			}
		},
		selectMenu(index, event) {
			if (!event._constructed) {
				return true
			}
			let foodList = this.$refs.foodWrap.getElementsByClassName('food-list-hook')
			let el = foodList[index]
			this.foodsScroll.scrollToElement(el, 300)
		},
		selectFood(food, event) {
			if (!event._constructed) {
				return true
			}
			this.selectedFood = food
			this.$refs.food.show()
		},
		_getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
			let r = window.location.search.substr(1).match(reg)
			if (r != null) {
				return unescape(r[2])
            } else {
				return null
			}
		}
	},
	components: {
		shopcart,
		cartcontrol,
		food
	}
}
</script>

<style lang="less">
	@import '../../common/less/base.less';

	.goods{
		.pos(a);
		top: 174px;
		bottom: 46px;
		display: flex;
		width: 100%;
		overflow: hidden;
		.menu-wrap{
			flex: 0 0 90px;
			width: 90px;
			.bg(#f3f5f7);
			.menu-item{
				position: relative;
				display: table;
				height: 54px;
				width: 90px;
				line-height: 14px;
				&.active{
					.pos(r);
					margin-top: -1px;
					z-index: 10;
					.bg(@gf);
					font-weight: 700;
					.text{
						&:after{
							display: none;
						}
					}
				}
				.icon{
					.ds(ib);
					vertical-align: top;
					width: 12px;
					height: 12px;
					margin-right: 2px;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease{
						.bg-image('./img/decrease_3');
					}
					&.discount{
						.bg-image('./img/discount_3');
					}
					&.guarantee{
						.bg-image('./img/guarantee_3');
					}
					&.invoice{
						.bg-image('./img/invoice_3');
					}
					&.special{
						.bg-image('./img/special_3');
					}
				}
				.text{
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					font-size: 12px;
					text-align: center;
					padding: 0 12px;
					.border-1px;
				}
				&:last-child{
					.text{
						&:after{
							display: none;
						}
					}
				}
			}
		}
		.foods-wrap{
			flex: 1;
			padding-bottom: 20px;
			.title{
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color: rgb(147,153,159);
				background-color: #f3f5f7;
			}
			.food-item{
				position: relative;
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				.border-1px;
				&:last-child:after{
					height: 0;
					// margin-bottom: 0;
				}
				&:last-child{
					margin-bottom: 0;
				}
				.icon{
					width: 57px;
					margin-right: 10px;
					img{
						width: 57px;
					}
				}
				.content{
					flex:1;
					.name{
						margin: 2px 0 8px 0;
						height: 14px;
						font-size: 14px;
						line-height: 14px;
						color: rgb(7,17,27);
					}
					.desc,.extra{
						font-size: 10px;
						line-height: 12px;
						color: rgb(147,153,159);
					}
					.desc{
						margin-bottom: 8px;
					}
					.extra{
						.count{
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
					.cartcontrol-wrap{
						.pos(a);
						right: 0;
						bottom: 10px;
					}
				}
			}
		}
	}

	.bg-image(@url){
	  @src:~`@{url} + '@2x.png'`;
	  background-image: url(@src);
	}
	@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
	  .bg-image(@url){
	    @src:~`@{url} + '@3x.png'`;
	    background-image: url(@src);
	  }
	}
</style>















