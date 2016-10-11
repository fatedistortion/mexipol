var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeekSchema = new Schema({
    name: String
});


module.exports = mongoose.model('Geek', GeekSchema);
