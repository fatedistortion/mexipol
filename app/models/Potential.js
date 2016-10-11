var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Modelo específico para Equipos, NO ACTIVADO EN routes.js
var taskPotSchema = new Schema({id: String});
var PotentialSchema = new Schema( {
 	id: String,
    title: String,
    accountId: String,
    contacto: String,
    origen: String,
    indiceDesc: Number,
    prioridad: String,
    precio: Number,
    descripcion: String,
    asignado: String,
    fechaInicio: Date,
    fechaDelecion: { type: Date, expires: '7d', default: Date.now },
    fechaCierre: String,
    estado: String,
    opportunities: [],
    valid: Boolean,
    tareas: [taskPotSchema]
	// ==Previous declaration
	// Opportunities 
});
PotentialSchema.pre("save", function(next) { 
    var nowDate = new Date();
    nowMonth=nowDate.getMonth();
    nowDay=nowDate.getDate();
    nowYear=nowDate.getFullYear();
    if(this.valid){
        this.fechaDelecion = null; 
        console.log('Saved a Potential WITHOUT expires');
    }else{
        this.fechaDelecion = new Date(nowYear, nowMonth, nowDay+7);
        console.log('Saved a Potential with expires');
    }
    if( typeof(this.indiceDesc) !='undefined'){
        if(this.indiceDesc){
            // If other than 0 or undefined
            console.log('Precio is: ',this.precio);
            this.precio=0;
            if(this.opportunities){
                for (var i = this.opportunities.length - 1; i >= 0; i--) {
                    this.precio=this.precio+this.opportunities[i].precio;
                };
            }
            
            this.precio=this.precio*(this.indiceDesc/100);
            console.log('Nuevo precio is: ',this.precio);
        }
    }
    next(); 
});
//Change to 15 days


module.exports = mongoose.model('Potential', PotentialSchema);
