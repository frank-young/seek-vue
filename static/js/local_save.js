(function(){
	var num = g('num').getAttribute('data-num'),
		domain = g('domain').getAttribute('data-domain'),
		openid = g('openid').getAttribute('data-openid')
	localSave(num,domain,openid)

	var url = 'http://frank.d1.natapp.cc/'

	window.location.href = url
})()

function g(id) {
	return document.getElementById(id)
}

function localSave(num,domain,openid) {
	localStorage.setItem('num', num)
	localStorage.setItem('domain', domain)
	localStorage.setItem('openid', openid)
}