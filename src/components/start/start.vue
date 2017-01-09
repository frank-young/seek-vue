<template>
  <div class="start">
    <div class="start-con">
    	<button class="btn" @click="start">
    		开始点餐
    	</button>
    </div>
  </div>
</template>

<script>
export default {
	name: 'start',
	data () {
		return {
		}
	},
	methods: {
		start() {
			this.$router.push('goods')
		}
	}
}
</script>

<style lang="less">
	.start {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.start-con {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn {
			position: relative;
			font-size: 18px;
			padding: 12px 35px;
			font-weight: 100;
			color: #3290e8;
			border: 0;
			background-color: transparent;
			outline: none;
			&:focus{
				background-color: rgba(0, 0, 0, 0.03);
			}
			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 200%;
				height: 200%;
				border: 1px solid #3290e8;
				border-radius: 8px;
				transform-origin: 0 0;
				-webkit-transform: scale(0.5, 0.5);
				transform: scale(0.5, 0.5);
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
			}
		}
	}
</style>
