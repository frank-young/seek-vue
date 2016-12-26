<template>
  <div class="cartcontrol">
  	<transition name="move">
  		<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
	  		<i class="inner icon-remove_circle_outline"></i>
	  	</div>
  	</transition>
  	<div class="cart-count" v-show="food.count>0">{{food.count}} </div>
  	<div class="cart-add" @click.stop.prevent="addCart($event)">
  		<i class="icon-add_circle"></i>
  	</div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
	props: {
		food: {
			type: Object
		}
	},
	methods: {
		addCart(event) {
			if (!event._constructed) {
				return true
			}
			if (!this.food.count) {
				Vue.set(this.food, 'count', 1)
			} else {
				this.food.count ++
			}
		},
		decreaseCart(event) {
			if (!event._constructed) {
				return true
			}
			if (this.food.count) {
				this.food.count --
			}
		}
	}

}
</script>

<style lang="less">
	.cartcontrol{
		.cart-decrease,
		.cart-add {
			display: inline-block;
			padding: 6px;
			line-height: 24px;
			font-size: 24px;
			color: rgb(0, 160, 220);
		}
		.cart-decrease{
			transition: all 0.3s;
			.inner{
				display: inline-block;
				transform: rotate(0);
				transition: all 0.3s;
			}
			&.move-enter-active,&.move-leave{
				opacity: 1;
				transform: translate3D(0,0,0);
			}
			&.move-enter,
			&.move-leave-active{
				opacity: 0;
				transform: translate3D(24px,0,0);
				.inner{
					transform: rotate(180deg);
				}
			}
		}
		.cart-count{
			display: inline-block;
			vertical-align: top;
			width: 12px;
			line-height: 24px;
			text-align: center;
			padding-top: 6px;
			font-size: 10px;
			color: #333;
		}
		.cart-add{
			
		}
	}
</style>











