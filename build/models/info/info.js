var mongoose = require('mongoose')	
var InfoSchema = require('../../schemas/info/info')
var Info = mongoose.model('Info',InfoSchema)

module.exports = Info
