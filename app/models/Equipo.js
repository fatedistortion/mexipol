var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Modelo específico para Equipos, NO ACTIVADO EN routes.js
var EquipoSchema = new Schema( {
    category: String,    
    model: String,
    imgsrc: String,
    caption: String,
    parameters: [Schema.Types.Mixed]
});


module.exports = mongoose.model('Equipo', EquipoSchema);
