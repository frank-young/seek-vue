<template>
	<transition name="move">
		<div v-show="showFlag" class="bill" ref="billScroll">
			<div class="bill-content" >
				<div class="bill-back">
					<i class="icon-arrow_lift" @click="hidden"></i>
					<span class="back-txt">确认订单</span>
				</div>
				<div class="title">西可咖啡</div>
				<div class="dish">
					<div class="dish-item" v-for="food in foods">
						<div class="dish-name">{{food.name}}</div>
						<div class="dish-count"><i>&times;</i>{{food.count}}</div>
						<div class="dish-price">¥{{food.price}} </div>
					</div>
				</div>
				<div class="dish">
					<div class="dish-item">
						<div class="dish-name"></div>
						<div class="dish-t-price"><span>待支付</span>¥{{totalPrice}}</div>
					</div>
				</div>
				<split></split>
				<div class="other">
					<div class="dish-item">
						<div class="dish-name">支付方式</div>
						<div class="dish-other"><span>在线支付</span></div>
					</div>
				</div>
				<div class="other">
					<div class="other-item">
						<select class="other-select" v-model="dishNumber" id="">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
						</select>
						<div class="dish-name">用餐人数</div>
						<div class="dish-other"><span v-show="dishNumber===1">选择用餐人数</span><span v-show="dishNumber!==1">{{dishNumber}}人</span> </div>
					</div>
				</div>
				<split></split>
			</div>
			<alertmsg :text="alertmsg" ref="alertmsg"></alertmsg>
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
import alertmsg from 'components/alertmsg/alertmsg'

export default {
	props: {
		foods: {
			type: Array
		}
	},
	data() {
		return {
			showFlag: false,
			dishNumber: 1,
			alertmsg: '提交成功'
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
		},
		pay(event) {
			if (this.totalPrice < this.minPrice) {
				return false
			}
			if (!event._constructed) {
				return true
			}

			let id = (parseInt(Math.random() * new Date() - 0)).toString(32)

			this._saveBillInfo(id)
			this.$refs.alertmsg.show()
			setTimeout(() => {
				this.$router.push({name: 'pay', params: {id: id}})
			}, 1000)
		},
		_saveBillInfo(id) {
			let data = {
				'domain': this.domain,
				'order': this._orderData(this.foods, this.totalPrice, this.domain, id)
			}

			let orders = this._isOrders() ? JSON.parse(window.localStorage.orders) : []

			orders.unshift(data)

			window.localStorage.setItem('orders', JSON.stringify(orders))
		},
		_isOrders() {
			if (window.localStorage.getItem('orders')) {
				return true
			}
		},
		_orderData(foods, price, domain, id) {
			let obj = {
				'isTop': false,
				'isChecked': false,
				'peopleNum': 1,
				'payType': 1,
				'payStatus': 1,
				'noincome': 0,
				'credit': 0,
				'erase': 0,
				'onceincome': 0,
				'cashincome': 0,
				'wxincome': price,
				'alipayincome': 0,
				'schoolincome': 0,
				'otherincome': 0,
				'petcardincome': 0,
				'cardincome': 0,
				'memberBalance': 0,
				'eatType': '大厅(微信点餐)',
				'total': price,
				'reduce': 0,
				'reduceAfter': price,
				'realTotal': price,
				'isMember': false,
				'isPetcard': false,
				'dish': this._foods(foods),
				'wxpayType': 0,
				'time': new Date(),
				'vId': id
			}
			obj.dishNum = decodeURI(this._getQueryString()['num'])
			obj.orderNum = this._createOrderNum(domain)
			return obj
		},
		_foods(data) {
			let arr = []
			if (data) {
				data.forEach((d) => {
					let obj = {}
					obj.name = d.name
					obj.price = d.price
					obj.reducePrice = d.price
					obj.number = d.count
					arr.push(obj)
				})
				return arr
			}
		},
		_createOrderNum(domain) {
			return domain + Math.round((Math.random() * (new Date() - 0)) * 10000) + ''
		},
		_getQueryString(name) {
			let arr = []
			let	hash = []
			let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')

			for (let i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=')
				arr.push(hash[0])
				arr[hash[0]] = hash[1]
			}
			return arr
		}
	},
	components: {
		split,
		alertmsg
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
		.bill-back{
			width: 100%;
			height: 48px;
			line-height: 48px;
			background-color: #3290e8;
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
			.dish-item,
			.other-item{
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
			.dish-other{
				flex: 0 0 100px;
				width: 100px;
				text-align: right;
				span{
					font-weight: normal;
					color: #666;
					font-size: 12px;
					line-height: 12px;
				}
				
			}
			.other-item{
				position: relative;
				.other-select{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 44px;
					outline: none;
					opacity: 0;

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
					background-color: #4cda64;
					color: #fff;
				}
			}

		}

	}
</style>
















