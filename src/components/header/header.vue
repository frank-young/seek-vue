<template>
  <div class="header">
    <div class="content-wrap">
    	<div class="avatar">
    		<img :src="seller.avatar" width="64" height="64">
    	</div>
    	<div class="content">
    		<div class="title">
    			<span class="brand">
    			</span>
    			<span class="name">{{seller.business_name}}({{seller.branch_name}})</span>
    		</div>
    		<div class="description">
    			{{seller.city}}{{seller.district}}{{seller.address}}
    		</div>
    		<div class="support">
    			<!-- <span class="icon" v-bind:class="classMap[seller.supports[0].type]"></span> -->
    			<span class="text">营业时间：{{seller.open_time}}</span>
    		</div>
    	</div>
    	<div class="support-count" v-on:click="showDetail">
    		<span class="count">{{num}}</span>
    	</div>
    </div>
    <div class="tip-wrap" v-on:click="showDetail">
    	<span class="tip-title"></span>
    	<span class="tip-text">{{seller.introduction}}</span><i class='icon-keyboard_arrow_right'></i>
    </div>
    <div class="background">
    	<img :src="seller.avatar" width="100%" >
    </div>
    <div v-show="detailShow" class="detail">
    	<div class="detail-main">
    		<div class="detail-name">
    			{{seller.name}}
    		</div>
    		<div class="detail-ratings">
    			<star v-bind:size="48" v-bind:score="seller.score"></star>
    		</div>
    		<div class="detail-sub-title">
    			关于SEEK
    		</div>
    		<div class="detail-bulletin">
    			{{seller.introduction}} <br>
    		</div>
    		<div class="detail-sub-title">
    			商家公告
    		</div>
    		<div class="detail-bulletin">
    			特殊：{{seller.special}} <br>
    			门店地址：{{seller.city}}{{seller.district}}{{seller.address}} <br>
    			营业时间：{{seller.open_time}} <br>
    			电话：{{seller.telephone}} <br>
    		</div>
    	</div>
    	<div class="detail-close">
    		<i class="icon-close" v-on:click="hideDetail"></i>
    	</div>
    </div>
  </div>
</template>

<script>
import star from 'components/star/star'

export default {
	props: {
		seller: {
			type: Object
		},
		num: {
			type: String
		}
	},
	data() {
		return {
			detailShow: false
		}
	},
	methods: {
		showDetail() {
			this.detailShow = true
		},
		hideDetail() {
			this.detailShow = false
		}
	},
	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
	},
	components: {
		star
	}
}
</script>

<style lang="less">
	@import '../../common/less/base.less';

	.header {
		.pos(r);
		color: @gf;
		background-color: rgba(7, 17, 27, 0.5);
		overflow: hidden;
		.content-wrap{
			padding: 24px 12px 18px 24px;
			font-size: 0;
			.pos(r);
		}
		.avatar {
			.ds(ib);
			vertical-align: top;
			img{
				.border-radius(2px);
			}
		}
		.content{
			.ds(ib);
			font-size: 14px;
			.m(l,16px);
		}
		.title{
			margin: 2px 0 8px 0;
			.brand{
				.ds(ib);
				width: 30px;
				height: 18px;
				vertical-align: bottom;
				.bg-image('./img/brand');
				background-size: 30px 18px;
				background-repeat: no-repeat;
			}
			.name{
				.m(l,6px);
				font-size: 16px;
				line-height: 18px;
				font-weight: bold;
			}
		}
		.description {
			.m(b,10px);
			line-height: 12px;
			font-size: 12px;
		}
		.support{
			font-size: 0;
			.icon{
				.ds(ib);
				vertical-align: top;
				width: 12px;
				height: 12px;
				margin-right: 4px;
				background-size: 12px 12px;
				background-repeat: no-repeat;

				&.decrease{
					.bg-image('./img/decrease_1');
				}
				&.discount{
					.bg-image('./img/discount_1');
				}
				&.guarantee{
					.bg-image('./img/guarantee_1');
				}
				&.invoice{
					.bg-image('./img/invoice_1');
				}
				&.special{
					.bg-image('./img/special_1');
				}
			}
			.text{
				line-height: 12px;
				font-size: 10px;
			}
		}
		.support-count{
			.pos(a);
			right: 12px;
			bottom: 12px;
			padding: 0 12px;
			height: 28px;
			line-height: 28px;
			.border-radius(14px);
			background-color: rgba(245, 99, 100, 1);
			.ta(c);
			.count{
				font-weight: normal;
				font-size: 14px;
			}
			.icon-keyboard_arrow_right{
				font-size: 10px;
				line-height: 24px;
				margin-left: 2px;
			}
		}
		.tip-wrap{
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
			background-color: rgba(7, 17, 27, 0.2);
			.pos(r);
			.tip-title{
				.ds(ib);
				vertical-align: top;
				width: 22px;
				height: 12px;
				.bg-image('./img/bulletin');
				background-size: 22px 12px;
				background-repeat: no-repeat;
				margin: 7px 4px 0 0;
			}
			.tip-text{
				vertical-align: top;
				font-size: 10px;
			}
			.icon-keyboard_arrow_right{
				.pos(a);
				top: 2px;
				right: 12px;
				font-size: 10px;
				line-height: 24px;
				margin-left: 2px;
			}
		}
		.background{
			.pos(a);
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter:blur(10px);
		}
		.detail{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			width: 100%;
			height: 100%;
			overflow: auto;
			background-color: rgba(7, 17, 27, 0.8);
			&-main{
				min-height: 100%;
				padding: 64px 36px;
				.box-sizing();
			}
			&-name{
				font-size: 16px;
				line-height: 16px;
				color: @gf;
				font-weight: 700;
				text-align: center;
				.m(b,16px);
			}
			&-ratings{
				height: 24px;
				.ta(c);
			}
			&-sub-title{
				.pos(r);
				.m(t,28px);
				.m(b,24px);
				.ta(c);
				font-size: 14px;
				font-weight: 700;
				line-height: 14px;
				color: @gf;
				&:before,
				&:after{
					content: '';
					.pos(a);
					top: 7px;
					height: 1px;
					width: 112px;
					background-color: rgba(255, 255, 255, 0.2);
				}
				&:before{
					left: 0;
				}
				&:after{
					right: 0;
				}
			}
			&-list{
				padding: 0 12px;
				font-size: 12px;
				line-height: 12px;
				font-weight: 200;
				.m(b,6px);
				height: 16px;
				&:last-child{
					.m(b,0);
				}
			}
			&-supports{

			}
			&-bulletin{
				padding: 0 12px;
				font-size: 12px;
				font-weight: 200;
				line-height: 24px;
				color: #fff;

			}
			&-close{
				.ta(c);
				margin-top: -64px;
				font-size: 32px;
				color: rgba(255, 255, 255, 0.5)
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