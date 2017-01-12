<template>
	<div class="sendcode" v-show="showFlag">
		<h3>如有会员卡，请直接输入手机号，获取验证码进行支付。<span>（会员卡暂时需要在前台办理，如有疑问请咨询服务员。）</span></h3>
		<div class="code-wrap">
			<div class="code-label">
				手机号
			</div>
			<div class="code-input">
				<input type="text" placeholder="请输入手机号" v-model="phone">
			</div>
			
		</div>
		<div class="code-wrap">
			<div class="code-label">
				验证码
			</div>
			<div class="code-very">
				<input type="text" placeholder="验证码" v-model="code">
			</div>
			<div class="code-btn">
				<a class="btn" :disabled="btnDisabled" @click.stop.prevent="sendCode($event)">{{btnText}}</a>
			</div>
		</div>
		<alertmsg :text="alertmsg" :icon="alerticon" ref="alertmsg"></alertmsg>
	</div>
</template>

<script>
import alertmsg from 'components/alertmsg/alertmsg'

const ERRNO_OK = 0

export default {
	props: {
		text: {
			type: String
		}
	},
	data() {
		return {
			showFlag: false,
			phone: null,
			code: null,
			timer: 60,
			btnText: '发送验证码',
			btnDisabled: false,
			alertmsg: '',
			alerticon: ''
		}
	},
	methods: {
		show() {
			this.showFlag = true
		},
		hide() {
			this.showFlag = false
		},
		sendCode(event) {
			if (!event._constructed) {
				return true
			}
			let rePhone = /^1[3|5|7|8]\d{9}$/
			if (rePhone.test(this.phone)) {
				this._sendCode(this.phone)
				this._resend()
			} else {
				this._alert('icon-close', '手机号错误')
			}
		},
		verify(callback) {
			this._verify(this.code, this.phone, callback)
		},
		_alert(icon = 'icon-checked', msg = '操作成功') {
			this.alerticon = icon
			this.alertmsg = msg
			this.$refs.alertmsg.show()
		},
		_sendCode(phone) {
			let options = {}
			let data = {
				'phone': phone
			}
			options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
			options.emulateJSON = true
			this.$http.post('/api/code/send', data, options).then((res) => {
				res = res.body
				if (res.errno === ERRNO_OK) {
				}
				console.log(res.msg)
			})
		},
		_verify(code, phone, callback) {
			let options = {}
			let data = {
				'code': code,
				'phone': phone
			}

			options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
			options.emulateJSON = true

			this.$http.post('/api/code/verify', data, options).then(callback)
		},
		_resend() {
			setInterval(() => {
				if (this.timer === 0) {
					this.btnText = '发送验证码'
					this.btnDisabled = false
				} else {
					this.btnText = this.timer + 's后重新发送'
					this.btnDisabled = true
					this.timer --
				}
			}, 1000)
		}
	},
	components: {
		alertmsg
	}
}
</script>

<style lang="less">
	.sendcode {
		padding: 10px 15px 10px 15px;
		h3{
			font-size: 12px;
			line-height: 1.6em;
			color: #666;
			margin-bottom: 15px;
			span {
				font-size: 10px;
				color: #fc6120;
			}
		}
		.code-wrap{
			display: flex;
			margin-bottom: 15px;
		}
		.code-label {
			flex: 0 0 80px;
			width: 80px;
			font-size: 14px;
			line-height: 29px;
			color: #333;
		}

		.code-input,
		.code-very {
			flex: 1;
			input {
				display: block;
				width: 100%;
				box-sizing: border-box;
				padding: 5px 10px;
				outline: none;
				border: 1px solid #ddd;
				font-size: 14px;
			}
		}
		.code-btn {
			// flex: 0 0 125px;
			// width: 125px;
			margin-left: 15px;
			.btn {
				height: 28px;
				padding: 0 10px;
				line-height: 28px;
				display: inline-block;
				background-color: rgb(252, 97, 32);
				border: 0;
				font-size: 12px;
				color: #fff;
				outline: none;
			}
			.btn[disabled]{
				background-color: #acacac;
			}
		}
	}
</style>
