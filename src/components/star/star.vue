<template>
  <div class="star" v-bind:class="starType">
    <span v-for="itemClass in itemClasses" v-bind:class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
	props: {
		size: {
			type: Number
		},
		score: {
			type: Number
		}
		},
	computed: {
		starType() {
			return 'star-' + this.size
		},
		itemClasses() {
			let result = []
			let score = Math.floor(this.score * 2) / 2
			let hasDecimal = score % 1 !== 0
			let integer = Math.floor(score)

			for (let i = 0; i < integer; i++) {
				result.push(CLS_ON)
			}

			if (hasDecimal) {
				result.push(CLS_HALF)
			}

			while (result.length < LENGTH) {
				result.push(CLS_OFF)
			}
			return result
		}
	}
}
</script>

<style lang="less">
	@import '../../common/less/base.less';

	.star{
		font-size: 0;
		&-item{
			.ds(ib);
			background-repeat: no-repeat;
		}

		&.star-48{
			.star-item{
				width: 20px;
				height: 20px;
				.m(r,22px);
				background-size: 20px 20px;
				&:last-child {
					margin-right: 0;
				}
				&.on{
					.bg-image("./img/star48_on");
				}

				&.half{
					.bg-image('./img/star48_half');
				}
				&.off{
					.bg-image('./img/star48_off');
				}
			}
		}
		&.star-36{
			.star-item{
				width: 15px;
				height: 15px;
				.m(r,16px);
				background-size: 15px 15px;
				&:last-child {
					margin-right: 0;
				}
				&.on{
					.bg-image('./img/star36_on');
				}
				&.half{
					.bg-image('./img/star36_half');
				}
				&.off{
					.bg-image('./img/star36_off');
				}
			}
		}
		&.star-24{
			.star-item{
				width: 10px;
				height: 10px;
				.m(r,3px);
				background-size: 10px 10px;
				&:last-child {
					margin-right: 0;
				}
				&.on{
					.bg-image('./img/star24_on');
				}
				&.half{
					.bg-image('./img/star24_half');
				}
				&.off{
					.bg-image('./img/star24_off');
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
