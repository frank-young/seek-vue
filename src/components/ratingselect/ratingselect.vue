<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType === 0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
			<span @click="select(1,$event)" class="block nagative" :class="{'active':selectType === 1}">{{desc.nagative}}<span class="count">{{nagative.length}}</span></span>
		</div>
		<div @click="toggleContent" class="switch" :class="{'on': onlyContent === true}" >
			<span class="icon-check_circle"></span>
			<span class="text">只看内容的评价</span>
		</div>
	</div>
</template>

<script>
const POSITIVE = 0
const NAGATIVE = 1
const ALL = 2

export default {
	props: {
		ratings: {
			type: Array,
			default() {
				return []
			}
		},
		selectType: {
			type: Number,
			default: ALL
		},
		onlyContent: {
			type: Boolean,
			default: false
		},
		desc: {
			type: Object,
			default() {
				return {
					all: '全部',
					positive: '满意',
					nagative: '不满意'
				}
			}
		}
	},
	computed: {
		positive() {
			return this.ratings.filter((rating) => {
				return rating.rateType === POSITIVE	// 通过 filter方法去拿到想要的值
			})
		},
		nagative() {
			return this.ratings.filter((rating) => {
				return rating.rateType === NAGATIVE
			})
		}
	},
	methods: {
		select(type, event) {
			if (!event._constructed) {
				return true
			}
			this.selectType = type
			this.$emit('ratingtype.select', type) // 子组件通知父组件变化
		},
		toggleContent(event) {
			if (!event._constructed) {
				return true
			}
			this.onlyContent = !this.onlyContent
			this.$emit('content.toggle', this.onlyContent)
		}

	}
}
</script>

<style lang="less">

	.ratingselect {
		.rating-type {
			padding: 18px 0;
			margin: 18px;
			.border-1px();
			font-size: 0;
			.block {
				display: inline-block;
				padding: 6px 12px;
				border-radius: 3px;
				margin-right: 8px;
				font-size: 12px;
				color: rgb(77, 85, 93);
				.count {
					margin-left: 2px;
					line-height: 16px;
					font-size: 8px;
				}
				&.active {
					color: #fff;
				}
				&.positive {
					background-color: rgba(0, 160, 220, 0.2);
					&.active {
						background-color: rgba(0, 160, 220, 1);
					}
				}
				&.nagative {
					background-color: rgba(77, 85, 93, 0.2);
					&.active {
						background-color: rgb(77, 85, 93);
					}
				}
				
			}
		}
		.switch {
			padding: 12px 18px;
			line-height: 24px;
			border-bottom: 1px solid rgba(7, 17, 27, 0.1);
			color: rgb(147, 153, 159);
			font-size: 0;
			&.on {
				.icon-check_circle{
					color: #00c850;
				}
			}
			.icon-check_circle{
				display: inline-block;
				vertical-align: top;
				margin-right: 4px;
				font-size: 24px;
				
			}
			.text{
				display: inline-block;
				vertical-align: top;
				font-size: 12px;
			}
		}
	}
	.border-1px(){
		position: relative;
	    &:after{
	        content: '';
	        position: absolute;
	        bottom: 0;
	        left: 0;
	        width: 100%;
	        height: 1px;
	        background-color: rgba(7, 17, 27, 0.1);
	        transform: scale(1,.5);
	    }
	}
</style>











