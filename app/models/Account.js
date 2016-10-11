var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Modelo específico para Equipos, NO ACTIVADO EN routes.js
var accPotSchema = new Schema({id: String});
var AccountSchema = new Schema( {
 	id: String,
    title:String,
    direccion: String,
    pais: String,
    estado: String,
    fechaDelecion: { type: Date, expires: '7d', default: Date.now },
    cp: String,
    tel:String,
    contacto:[Schema.Types.Mixed],
    tipo: String,
    valid: Boolean,
    potentials:[accPotSchema]
	// Account Schema 
});
AccountSchema.pre("save", function(next) { 
    console.log(this);
    var nowDate = new Date();
    nowMonth=nowDate.getMonth();
    nowDay=nowDate.getDate();
    nowYear=nowDate.getFullYear();
    if(this.valid){
        this.fechaDelecion = null; 
        console.log('Saved an Account WITHOUT expires');
    }else{
        this.fechaDelecion = new Date(nowYear, nowMonth, nowDay+7);
        console.log('Saved an Account with expires');
    }
    next(); 
});
//Change to 15 days

module.exports = mongoose.model('Account', AccountSchema);
