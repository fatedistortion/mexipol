var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Modelo específico para Equipos, NO ACTIVADO EN routes.js
var subtaskSchema = new Schema({contact: String, subject: String});
var TaskSchema = new Schema( {
 	id: String,
    title: String,
    taskType: String,
    accountId: String,
    idPotential: String,
    priority: String,
    contact: String,
    descripcion: String,
    taskOwner: String,
    dueDate: Date,
    fechaDelecion: Date,
    modified: Date,
    recordar: Date,
    status: String,
    valid: Boolean,
    information: [{}]
	// ==Previous declaration
	// Opportunities 
});
TaskSchema.pre("save", function(next) { 
    console.log('this.taskType: ', this.taskType);
	if(!this.taskType){
		this.taskType = 'General';
	}
    if(this.valid){
        this.fechaDelecion = null; 
        console.log('Saved a Potential WITHOUT expires');
    }else{
        this.fechaDelecion = new Date();
        console.log('Saved a Potential with expires');
    }
    this.modified = new Date();
    console.log('Modified Date: ', this.modified);
    next(); 
});
TaskSchema.path('fechaDelecion').expires('1h');
//Change to 15 days


module.exports = mongoose.model('Task', TaskSchema);
