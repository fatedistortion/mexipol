/*
var Nerd = require('./models/Nerd.js');
var Geek = require('./models/Geek.js');
*/
module.exports = function (app, Nerd, Geek, Potential, Account, Task) {

	// server routes ==============Nerd=============================================
	// handle things like api calls and CRUD
	// authentication routes

    // sample api route
    app.get('/api/nerds', function (req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function (err, nerds) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(nerds); // return all nerds in JSON format
        });
    });

    app.get('/api/geeks', function (req, res) {
        // use mongoose to get all nerds in the database
        Geek.find(function (err, geeks) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(geeks); // return all nerds in JSON format
        });
    });
    app.get('/api/potentials', function (req, res) {
        // use mongoose to get all nerds in the database
        Potential.find(function (err, potentials) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(potentials); // return all nerds in JSON format
        });
    });
    app.get('/api/tasks', function (req, res) {
        // use mongoose to get all nerds in the database
        Task.find(function (err, tasks) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(tasks); // return all nerds in JSON format
        });
    });
    app.get('/api/accounts', function (req, res) {
        // use mongoose to get all nerds in the database
        Account.find(function (err, accounts) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(accounts); // return all nerds in JSON format
        });
    });

    // route to handle creating (app.post)

    app.post('/api/nerds', function (req, res) {

        Nerd.create({//Ought to be adequate to Nerd's Mongoose Model
                name: req.body.name,
                done: false
            }, function (err, nerd) {
                if (err)
                    res.send(err);

                // get and return all the nerds after you create another
                Nerd.find(function (err, nerds) {
                    if (err)
                        res.send(err);

                    res.json(nerds);
                });
        });

    });

    app.post('/api/geeks', function (req, res) {

            Geek.create({//Ought to be adequate to Geek's Mongoose Model
                name: req.body.name,
                done: false
            }, function (err, geek) {
                if (err)
                    res.send(err);

                // get and return all the geeks after you create another
                Geek.find(function (err, geeks) {
                    if (err)
                        res.send(err);

                    res.json(geeks);
                });
            });

    });
    app.post('/api/potentials', function (req, res) {
        Potential.where({ id: req.body.id}).findOne(function(err, potential){
            if (err) return handleError(err);
                if (potential) {
                console.log('Potential exists! Forbidden: ', potential.id);
                res.status(403);
                }else{
                    // Only of potential doesn't exist create a new one
                    // if potential exists, needs to be passed from :potential_Id routine
                    console.log('New Exists');
                    if(req.body.valid){
                        // if true, set null to fechaDelecion
                        var delecion=null;
                        console.log('UnExpired Potential created');
                    }else{
                        var delecion=new Date();

                    }
                    Potential.create({
                        id: req.body.id,
                        title: req.body.title,
                        accountId: req.body.accountId,
                        contacto: req.body.contacto,
                        origen: req.body.origen,
                        indiceDesc: req.body.indiceDesc,
                        prioridad: req.body.prioridad,
                        descripcion: req.body.descripcion,
                        precio: req.body.precio,
                        asignado: req.body.asignado,
                        fechaInicio: req.body.fechaInicio,
                        fechaDelecion: delecion,
                        fechaCierre: req.body.fechaCierre,
                        estado: req.body.estado,
                        opportunities: req.body.opportunities,
                        valid: req.body.valid,
                        tareas: req.body.tareas
                    //Ought to be adequate to Potential's Mongoose Model
                        }, function (err, potentials) {
                            if (err)
                                res.send(err);

                            // get and return all the nerds after you create another
                            Potential.find(function (err, potentials) {
                                if (err)
                                    res.send(err);

                                res.send({id: req.body.id, title: req.body.title, accountId: req.body.accountId,})
                                //res.json(potentials);
                                //Angular $resource doesn't expect array response, if given it causes error
                            });
                    });
                }
        })
    });
    app.post('/api/tasks', function (req, res) {
        Task.where({ id: req.body.id}).findOne(function(err, task){
            if (err) return handleError(err);
                if (task) {
                console.log('Task exists! Forbidden: ', task.id);
                res.status(403);
                }else{
                    // Only of Task doesn't exist create a new one
                    // if Task exists, needs to be passed from :Task routine
                    console.log('New Exists');
                    if(req.body.valid){
                        // if true, set null to fechaDelecion
                        var delecion=null;
                        console.log('UnExpired Task created');
                    }else{
                        var delecion=new Date();

                    }
                    Task.create({
                        id: req.body.id,
                        title: req.body.title,
                        accountId: req.body.accountId,
                        idPotential: req.body.idPotential,
                        priority: req.body.priority,
                        descripcion: req.body.descripcion,
                        taskOwner: req.body.taskOwner,
                        dueDate: req.body.dueDate,
                        fechaDelecion: delecion,
                        modified: req.body.modified,
                        recordar: req.body.recordar,
                        status: req.body.status,
                        valid: req.body.valid,
                        taskType: req.body.taskType,
                        information: req.body.subtasks
                    //Ought to be adequate to Task's Mongoose Model
                        }, function (err, tasks) {
                            if (err)
                                res.send(err);

                            // get and return all the nerds after you create another
                            Task.find(function (err, tasks) {
                                if (err)
                                    res.send(err);

                                res.send({id: req.body.id, title: req.body.title, accountId: req.body.accountId,})
                                //res.json(Task);
                                //Angular $resource doesn't expect array response, if given it causes error
                            });
                    });
                }
        })
    });
    app.post('/api/accounts', function (req, res) {
        // Requires a validation for double inputs
        // iF ACCOUNT EXISTS, update must be passed from /:account_ID
        Account.where({ id: req.body.id}).findOne(function (err, account) {
          if (err) return handleError(err);
          if (account) {
            console.log('Account exists! Forbidden: ', account.id);
            res.status(403);
          }else{
            console.log('Account doesnt exist');
            if(req.body.valid){
                // if true, set null to fechaDelecion
                var delecion=null;
                console.log('UnExpired Account created');
            }else{
                var delecion=new Date();
                console.log('Added new Date for Deletion')
            }
            console.log('Post Request account: ', req.body);
            Account.create({
                id:  req.body.id,
                title: req.body.title,
                direccion: req.body.direccion,
                pais: req.body.pais,
                estado: req.body.estado,
                fechaDelecion: delecion,
                cp: req.body.cp,
                tel:req.body.tel,
                contacto:req.body.contacto,
                tipo: req.body.tipo,
                valid: req.body.valid,
                potentials:req.body.potentials
            //Ought to be adequate to Potential's Mongoose Model
                }, function (err, accounts) {
                    if (err)
                        res.send(err);

                    res.status(200);

                    // get and return all the nerds after you create another
                    /* Deprecated, $resource doesn't expect a return value
                    Account.find(function (err, accounts) {
                        if (err)
                            res.send(err);

                        // res.send({id: req.body.id, title: req.body.title, potentials: req.body.potentials,})
                        // res.json(accounts);
                        // Angular $resource doesn't expect an array response, if given it causes error
                    });
                    */
            });
          }
        });
    });

    // route to handle delete (app.delete)
    app.delete('/api/potentials/:potential_id', function (req, res) {
        console.log('To Remove potential: ',req.params.potential_id);
        Potential.remove({
            _id: req.params.potential_id
        }, function (err, potential) {
            if (err)
                res.send(err);

            res.send('Ok '+req.params.potential_id);
        });
    });
    app.get('/api/potentials/:potential_id', function (req, res) {
        if(!req.params.potential_id.indexOf('ac-')){
            // It's an accountId, return all Tasks
            console.log('Finding potentials by account');
            Potential.find({
                "accountId": req.params.potential_id
                }).
            sort({ id: -1 }).
            exec(function (err, task) {
                    if (err)
                        res.send(err);
                    res.json(task);

                });
        }else{
            Potential.findOne({
                "id": req.params.potential_id
                }, function (err, potential) {
                    if (err)
                        res.send(err);
                    res.json(potential);
            });
        }

    });
     app.post('/api/potentials/:potential_id', function (req, res) {
        // Uses the general potentials' Id, not the document's ID, used for update
        console.log('Potential Posted to: ',req.params.potential_id);
        Potential.findOne({
            "id": req.params.potential_id
            }, function (err, potential) {
                if (err)
                    res.send(err);
                // Verify if passed potential is valid, if so, create a new date for it
                if(potential){
                    console.log(typeof(potential));
                    console.log('found: ',potential.id);
                    console.log(req.body);
                    if(req.body.valid){
                        // if true, set null to fechaDelecion
                        var delecion=null;
                        console.log('UnExpired Account created');
                    }else{
                        var delecion=new Date();
                        console.log('Added new Date for Deletion');
                    }

                    potential.id= req.body.id,
                    potential.title= req.body.title,
                    potential.accountId= req.body.accountId,
                    potential.contacto= req.body.contacto,
                    potential.origen= req.body.origen,
                    potential.indiceDesc= req.body.indiceDesc,
                    potential.prioridad= req.body.prioridad,
                    potential.precio= req.body.precio,
                    potential.descripcion= req.body.descripcion,
                    potential.asignado= req.body.asignado,
                    potential.fechaInicio= req.body.fechaInicio,
                    potential.fechaDelecion= delecion,
                    potential.fechaCierre= req.body.fechaCierre,
                    potential.estado= req.body.estado,
                    potential.opportunities= req.body.opportunities,
                    potential.valid= req.body.valid,
                    potential.tareas= req.body.tareas
                    potential.save();
                    //Might cahnge res.json(potential) for res.send(potential)
                    res.json(potential);
                }
            });
    });
    app.get('/api/tasks/:task_id', function (req, res) {
        // Identify if passedId is an accountId (ac-) or a taskId (tas-)
        if(!req.params.task_id.indexOf('tas-')){
            // It's a taskID thich beguins with 'tas-'
            Task.findOne({
                "id": req.params.task_id
                }, function (err, task) {
                    if (err)
                        res.send(err);
                    res.json(task);

                });
        }else if(!req.params.task_id.indexOf('ac-')){
            // It's an accountId, return all Tasks
            Task.find({
                "accountId": req.params.task_id
                }).
            sort({ id: -1 }).
            exec(function (err, task) {
                    if (err)
                        res.send(err);
                    res.json(task);

                });
        }else{
            Task.find({
                "idPotential": req.params.task_id
                }).
            sort({ id: -1 }).
            exec(function (err, task) {
                    if (err)
                        res.send(err);
                    res.json(task);

                });
        }
        });

         app.post('/api/tasks/:task_id', function (req, res) {
            // Uses the general potentials' Id, not the document's ID, used for update
            console.log('Task Posted to: ',req.params.task_id);
            Task.findOne({
                "id": req.params.task_id
                }, function (err, task) {
                    if (err)
                        res.send(err);
                    // Verify if passed potential is valid, if so, create a new date for it
                    if(task){
                        console.log(typeof(task));
                        console.log('found: ',task.id);
                        console.log(req.body);
                        if(req.body.valid){
                            // if true, set null to fechaDelecion
                            var delecion=null;
                            console.log('UnExpired task created');
                        }else{
                            var delecion=new Date();
                            console.log('Added new Date for Deletion');
                        }

                        task.id= req.body.id,
                        task.title= req.body.title,
                        task.accountId= req.body.accountId,
                        task.idPotential= req.body.idPotential,
                        task.priority= req.body.priority,
                        task.contact= req.body.contact,
                        task.descripcion= req.body.descripcion,
                        task.taskOwner= req.body.taskOwner,
                        task.dueDate= req.body.dueDate,
                        task.fechaDelecion= delecion,
                        task.modified= req.body.modified,
                        task.recordar= req.body.recordar,
                        task.status= req.body.status,
                        task.valid= req.body.valid,
                        task.information= req.body.information
                        task.save();
                        //Might cahnge res.json(Task) for res.send(Task)
                        res.json(task);
                    }
                });
        });
     app.delete('/api/tasks/:task_id', function (req, res) {
        // Uses Document's ID not account's id
        Task.remove({
            _id: req.params.task_id
        }, function (err, task) {
            if (err)
                res.send(err);

            res.send('Ok '+req.params.task_id);
        });
    });
     app.get('/api/notifications/:taskOwner', function (req, res) {
        // taskOwner is passed as "Alex-Ruiz", change to "Alex Ruiz" in route
        var owner = req.params.taskOwner.replace("-", " ");
        var thisDate = new Date; // To get a date range of last 15 days to current

            Task.find({
                "taskOwner": owner,
                 modified : {
                    '$gte': (new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()-15)).toString(),
                    '$lte': (new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+1)).toString()
                }
                }, function (err, task) {
                    if (err)
                        res.send(err);
                    res.json(task);

                });
        });
    app.delete('/api/accounts/:account_id', function (req, res) {
        // Uses Document's ID not account's id
        console.log('To Remove account: ',req.params.account_id);
        Account.remove({
            _id: req.params.account_id
        }, function (err, account) {
            if (err)
                res.send(err);

            res.send('Ok');
        });
    });
    app.get('/api/accounts/:account_id', function (req, res) {
        // Uses the general account Id, not the document's ID, allowing to use for query
        console.log('Asked for: ',req.params.account_id);
        Account.findOne({
            "id": req.params.account_id
            }, function (err, account) {
                if (err)
                    res.send(err);
                res.json(account);

            });
    });
    app.post('/api/accounts/:account_id', function (req, res) {
        //Using accountId not document id
        console.log('Account Posted to: ',req.params.account_id);
        Account.findOne({
            "id": req.params.account_id
            }, function (err, account) {
                if (err)
                    res.send(err);
                // Initialize perOne update
                if(account){
                    console.log(typeof(account));
                    console.log('found: ',account.id);
                    if(req.body.valid){
                        // if true, set null to fechaDelecion
                        var delecion=null;
                        console.log('UnExpired Account created');
                    }else{
                        var delecion=new Date();
                        console.log('Added new Date for Deletion');
                    }
                    console.log('req.potentials: ',req.body.potentials);
                    account.id=  req.body.id;
                    account.title= req.body.title;
                    account.direccion= req.body.direccion;
                    account.pais= req.body.pais;
                    account.estado= req.body.estado;
                    account.fechaDelecion= delecion;
                    account.cp= req.body.cp;
                    account.tel=req.body.tel;
                    account.contacto=req.body.contacto;
                    account.tipo= req.body.tipo;
                    account.valid= req.body.valid;
                    account.potentials=req.body.potentials;
                    //res.json(account);
                    account.save();
                    res.send(req.body);
                }


            });
    });

    app.delete('/api/nerds/:nerd_id', function (req, res) {
        Nerd.remove({
            _id: req.params.nerd_id
        }, function (err, nerd) {
            if (err)
                res.send(err);

            // get and return all the nerds after you create another
            Nerd.find(function (err, nerds) {
                if (err)
                    res.send(err);

                res.json(nerds);
            });
        });
    });
    app.delete('/api/geeks/:geek_id', function (req, res) {
        Geek.remove({
            _id: req.params.geek_id
        }, function (err, geek) {
            if (err)
                res.send(err);

            // get and return all the geeks after you create another
            Geek.find(function (err, geeks) {
                if (err)
                    res.send(err);

                res.json(geeks);
            });
        });
    });



	// frontend routes =========================================================
    var hostHeader = function(reqHeader){
       if((reqHeader == 'mexipol.com.mx') || (reqHeader == 'www.mexipol.com.mx')
       || (reqHeader == 'localhost:8080') || (reqHeader == '70.35.195.234')) {
        return true
       } else {
        return false
       }
    }
    // route to handle all angular requests

    app.get('/robots.txt', function (req, res) {
        res.sendfile('./public/robots.txt');
        console.log('sending robots.txt');
    });
    app.get('/testJson', function (req, res) {

        res.json(jsonF);

        })
    app.get(/sitemap|sitemap.xml/, function (req, res) {
        res.sendfile('./public/sitemap.xml');
        console.log('sending sitemap');
    });

    app.get(/quimicos/, function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });
    app.get(/equipos/, function (req, res) {
       if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404);
    });
    app.get(/aplicaciones/, function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });
    app.get(/asistencia/, function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });
    app.get(/eventos/, function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });

    app.get('/main', function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });
    app.get(/nerds/, function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });
    app.get('*', function (req, res) {
        console.log(req.header('host'));
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });
    app.get('/crm', function (req, res) {
        if (hostHeader(req.header('host')))
            res.sendfile('./public/index.html');
        else
            res.status(404)
            .send('Not valid Host');
    });

    // === CRM SPECIFIC API
     app.get('/api/crm', function (req, res) {
        // use mongoose to get all nerds in the database
        if (hostHeader(req.header('host'))){
        Nerd.find(function (err, nerds) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(nerds); // return all nerds in JSON format
        });
    }else{
        res.status(404)
            .send('Not valid Host');
    }
    });
};
