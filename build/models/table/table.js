var mongoose = require('mongoose')	
var TableSchema = require('../../schemas/table/table')
var Table = mongoose.model('Table',TableSchema)

module.exports = Table
