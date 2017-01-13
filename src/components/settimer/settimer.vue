<template>
	<div class="settimer" v-html="computedTime">
	</div>
</template>

<script>
import VueRouter from 'vue-router'

const router = new VueRouter()
export default {
	props: {
		timer: {
			type: Number
		},
		vId: {
			type: String
		}
	},
	data() {
		return {
			orders: JSON.parse(window.localStorage.getItem('orders')),
			t: 0,
			timestop: 30,
			Interval: null
		}
	},
	computed: {
		computedTime() {
			if (this.t < 60 && this.t > 0) {
				return '<span>' + this.t + '秒</span>'
			} else if (this.t <= 0) {
				return '<span>支付已经取消</span>'
			} else {
				let min = Math.floor(this.t / 60)
				let sec = this.t % 60
				return '<span>' + min + ' 分 ' + sec + ' 秒</span>'
			}
		}
	},
	created() {
		this.t = 60 * 15 - (Math.ceil((new Date() - 0) / 1000) - this.timer)
	},
	methods: {
        starttimer() {
			this.Interval = setInterval(() => {
				if (this.t <= 0) {
					clearInterval(this.Interval)
					this.orders.forEach((order) => {
						if (order.order.vId === this.vId) {
							order.order.wxpayType = 2
						}
					})
					window.localStorage.setItem('orders', JSON.stringify(this.orders))
					router.push('order')
				} else {
					this.t--
				}
			}, 1000)
        }
	},
	_refresh(vId) {
		this.orders.forEach((order) => {
			if (order.order.vId === vId) {
				order.order.wxpayType = 2
			}
		})
		window.localStorage.setItem('orders', JSON.stringify(this.orders))
	}
}
</script>

<style lang='less'>
	.settimer{
		display: inline;
	}

</style>











