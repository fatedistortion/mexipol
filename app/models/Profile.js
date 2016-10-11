var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
    name: String
});


module.exports = mongoose.model('Profile', GeekSchema);
