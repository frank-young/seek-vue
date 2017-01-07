<template>
	<div class="sendcode" v-show="showFlag">
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
				<button type="button" class="btn" :disabled="btnDisabled" @click="sendCode">{{btnText}}</button>
				<!-- <button class="btn">（60s）重新发送</button> -->
			</div>
		</div>
		
	</div>
</template>

<script>
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
			btnDisabled: false
		}
	},
	methods: {
		show() {
			this.showFlag = true
		},
		hide() {
			this.showFlag = false
		},
		sendCode() {
			this._sendCode(this.phone)
			this._resend()
		},
		verify(callback) {
			this._verify(this.code, this.phone, callback)
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
	}
}
</script>

<style lang="less">
	.sendcode {
		padding: 10px 15px 10px 15px;
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
			button {
				height: 28px;
				padding: 0 10px;
				line-height: 12px;
				display: inline-block;
				background-color: rgb(252, 97, 32);
				border: 0;
				font-size: 12px;
				color: #fff;
				outline: none;
			}
			button[disabled]{
				background-color: #acacac;
			}
		}
	}
</style>
