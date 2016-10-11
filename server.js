// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var morgan         = require('morgan'); 			// log requests to the console (express4)
var bodyParser     = require('body-parser');        // pull information from HTML POST (express4)
var methodOverride = require('method-override');    // simulate DELETE and PUT (express4)
var phantom = require('phantom');                   // PhantomJS Bridge

//Nodemailer Dependencies
var nodemailer      = require('nodemailer');        // Nodemailer include
var smtpTransport   = require('nodemailer-smtp-transport');
var wellknown       = require('nodemailer-wellknown');


// configuration ===========================================

// config files
var db = require('./config/db');
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(require('prerender-node').set('prerenderToken', '5PMxqb2e43aKLO0MNhwQ')); //Prerrender AOUTH

var Nerd = require('./app/models/Nerd.js');
var Geek = require('./app/models/Geek.js');
var Equipo = require('./app/models/Equipo.js');
var Potential = require('./app/models/Potential.js');
var Account = require('./app/models/Account.js');
var Task = require('./app/models/Task.js');

// routes ==================================================
require('./app/routes')(app, Nerd, Geek, Potential, Account, Task); // pass our application into our routes

// Nodemailer ==================================================
//app.use(express.json());  // to support JSON-encoded bodies, bundled separately might note be needed due to bodyParser
//Probably a good idea to move to a module export using require.

var SMTPoptions = {
    service: 'Mailgun',
    auth: {
        user: 'postmaster@mexipol.com.mx',
        pass: '31ea09330184d67971897de246b8cec3'
    }
};

app.post('/mailPost', function (req, res) {
    var smtpTrans = nodemailer.createTransport(smtpTransport(SMTPoptions));
    //Variables are body. : subject, text, name, mail, phone, ext, business, address
    var mailOptions = {
        from: 'Sistema Mexipol <postmaster@mexipol.com.mx>',
        to: 'aruiz@mexipol.com.mx',
        //to: 'thisiswhatisoundlike@gmail.com',
        replyTo: req.body.mail,
        subject: req.body.subject,
        text: req.body.text,
        //Use object : req.body.ng-model to be posted from angular,
        html: '<html><body><div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width:500px; "><h1 style="font-weight: 300;color: rgb(90, 123, 124);border-bottom: 1px solid rgb(105, 169, 171);"> Datos de contacto </h1>'+
            '<div style="margin-left:15px;"><div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;margin-bottom: 14px;">'+
            '<p><label style="color: #8291B3;">Nombre: </label>' + req.body.name + '</p>'+
            '<p><label style="color: #8291B3;"> Mail: </label>'+ req.body.mail + '</p>'+
            '<p><label style="color: #8291B3;"> Telefono: </label>'+ req.body.phone +
            '<label style="color: #8291B3;">ext: </label>' + req.body.ext +
            '</p></div>'+
            '<div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;">'+
            '<p><label style="color: #8291B3;"> Empresa: </label>'+ req.body.business + '</p>'+
            '<p><label style="color: #8291B3;"> Direcci\xF3n: </label>'+ req.body.address + '</p></div>'+
            '<p><em>'+req.body.text + '</em></p></div></div></body></html>'
    };

    smtpTrans.sendMail(mailOptions, function (err, responseStatus) {
        smtpTrans.close(); // Don't forget to close the connection pool!
        console.log('/mailPost sendMail Called');
        if (err)
            res.send(err);
        res.end('It worked!');//Response required for Angular & Express method
    });
});

app.post('/mailActivation', function (req, res) {
    var smtpTrans = nodemailer.createTransport(smtpTransport(SMTPoptions));
    //Variables are body. : subject, text, name, correo, tel, ext, business, address
    //Variables should be modified using $http.get on Angular controller
    var mailOptions = {
        from: 'Sistema Mexipol <activation@mexipol.com.mx>',
        to: req.body.contacto.correo,
        replyTo: 'aruiz@mexipol.com.mx',
        subject: 'Nueva cuenta para: '+req.body.contacto.nombre,
        text: 'Por favor visualice este correo en formato html, o siga a la ligapara activar su cuenta en Mexipol: ',
        //Use object : req.body.ng-model to be posted from angular,
        html: '<html><body><div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width:500px; ">'+
            '<h1 style="font-weight: 300;color: rgb(90, 123, 124);border-bottom: 1px solid rgb(105, 169, 171);"> Activación de Cuenta </h1>'+
            '<div style="margin-left:15px;"><div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;margin-bottom: 14px;">'+
            '<p><label style="color: #8291B3;">Nombre: </label>' + req.body.contacto.nombre + '</p>'+
            '<p><label style="color: #8291B3;"> Mail: </label>'+ req.body.contacto.correo + '</p>'+
            '<p><label style="color: #8291B3;"> Telefono: </label>'+ req.body.contacto.tel + '</p>' +
            '<div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;">'+
            '<p><label style="color: #8291B3;"> Empresa: </label><a href="http://mexipol.com.mx/activation/'+req.body.accountId+'/'+req.body.potentialId+'">'+ req.body.accountId + '</a></p>'+
            '<p><em> Su número de cotización es: '+req.body.potentialId + '</em><br> Acceda a:<b> <a href="http://mexipol.com.mx/activation/'+req.body.accountId+'/'+req.body.potentialId+'"> http://mexipol.com.mx/activation/'+req.body.accountId+'/'+req.body.potentialId+' </a></b> para activar su cuenta</p></div>'+
            '</div></body></html>'
    };
    smtpTrans.sendMail(mailOptions, function (err, responseStatus) {
        smtpTrans.close(); // Don't forget to close the connection pool!
        console.log('/mailActivation sendMail Called');
        if (err)
            res.send(err);
        res.end('It worked!');//Response required for Angular & Express method
    });
});

app.post('/mailCotizacion', function (req, res) {
    var secondsName=(new Date).getSeconds();    // <- Use secondsName to have various secuential copies and allow longet setTimeout times

    var smtpTrans = nodemailer.createTransport(smtpTransport(SMTPoptions));

    // Define typical configuration parameters
    var mailOptions = {
        from: 'Sistema Mexipol <activation@mexipol.com.mx>',
        to: req.body.contacto.correo,
        replyTo: 'aruiz@mexipol.com.mx',
        subject: 'Nueva cotización para: '+req.body.contacto.nombre,
        text: 'Adjuntamos la cotización actualizada para su cuenta en Mexipol, si no puede visualizar el correo acceda a: http://mexipol.com.mx/cotizacion/'+req.body.accountId+"/"+req.body.potentialId+'  para verla en línea',
        html:  '<html><body><div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width:500px; ">'+
            '<h1 style="font-weight: 300;color: rgb(90, 123, 124);border-bottom: 1px solid rgb(105, 169, 171);"> Adjuntamos la cotización actualizada para su cuenta en Mexipol </h1>'+
            '<div style="margin-left:15px;"><div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;margin-bottom: 14px;">'+
            '<p>si no puede visualizar el correo acceda a: <a href="http://mexipol.com.mx/cotizacion/'+req.body.accountId+'/'+req.body.potentialId+'">Cotización: '+ req.body.potentialId + '</a> para verla en línea</p>'+
            '</div></div></div></body></html>',
        attachments: [{
            filename: 'mexipol.pdf',
            path: process.env.PWD+'/public/temporal/mexipol_'+secondsName+'.pdf',
            contentType: 'application/pdf'
        }]
        //Use object : req.body.ng-model to be posted from angular,
       /* html: '<html><body><div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width:500px; ">'+
            '<h1 style="font-weight: 300;color: rgb(90, 123, 124);border-bottom: 1px solid rgb(105, 169, 171);"> Activación de Cuenta </h1>'+
            '<div style="margin-left:15px;"><div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;margin-bottom: 14px;">'+
            '<p><label style="color: #8291B3;">Nombre: </label>' + req.body.contacto.nombre + '</p>'+
            '<p><label style="color: #8291B3;"> Mail: </label>'+ req.body.contacto.correo + '</p>'+
            '<p><label style="color: #8291B3;"> Telefono: </label>'+ req.body.contacto.tel +
            '<div style="padding: 5px 0px 5px 25px; border: solid 1px #EDE7E1;">'+
            '<p><label style="color: #8291B3;"> Empresa: </label><a href="mexipol.com.mxlocalhost:8080/activation/'+req.body.accountId+'">'+ req.body.account + '</a></p>'+
            '<p><em>'+req.body.text + '</em></p></div>'+
            '</div></body></html>'
            */
    };
    // Phantom Autorender, get parameters from req.body
    phantom.create(function(ph) {
       ph.createPage(function(page) {
        //  page.set("viewportSize", {width: 1920, height: 1080 });
        page.set('paperSize', {format: 'A4', orientation: 'portrait'});
        page.set('zoomFactor', 0.25);
         page.open("http://localhost:8080/cotizacion/"+req.body.accountId+"/"+req.body.potentialId, function(status) {
           console.log("opened /cotizacion/"+req.body.accountId+"/"+req.body.potentialId, status);
           page.evaluate((function() {
             return document.title;
           }), function(result) {
            // Using a set Timeout function is necesary to give Angular Time to resolve APP
            setTimeout(function(){
                console.log('Page title is ' + result);
                page.render('public/temporal/mexipol_'+secondsName+'.pdf', {format: 'pdf', quality: '100'});
                ph.exit();
                setTimeout(function(){
                    smtpTrans.sendMail(mailOptions, function (err, responseStatus) {
                    smtpTrans.close(); // Don't forget to close the connection pool!
                    console.log('/mailCotizacion sendMail Called');
                    if (err)
                        res.send(err);
                        console.log('responseStatus: ',responseStatus);
                        res.end('It worked!');//Response required for Angular & Express method
                    });
                }, 900);
             },2350);
           });
         });
       });
    });
});


// start app ===============================================
var port = process.env.PORT || 8080; // set our port
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
