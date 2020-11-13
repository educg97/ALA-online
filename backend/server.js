const express = require('express');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const request = require('request');
const app = express();
const environment = require('./environment');
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const Imap = require('imap'),
    inspect = require('util').inspect;
const fs = require('fs');
const MailParser = require("mailparser").MailParser;
const simpleParser = require('mailparser').simpleParser;
const Promise = require("bluebird");
const cors = require("cors");
Promise.longStackTraces();

const DeviceDetector = require("device-detector-js");
const deviceDetector = new DeviceDetector();

const env = environment.environment;

// const stripe = require('stripe')(env.stripe_sk);
const stripe = require('stripe')(env.stripe_sk_test);

// Nodemailer.js
var transporter = nodemailer.createTransport({
    host: 'mail.americanlanguage.academy',
    port: 465,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: env['mail_username'],
        pass: env['mail_password']
    }
});

transporter.verify(function (error, success) {
    if (error) console.error(error);
    if (success) console.log(success);
})

var token;
// auth();

app.use(cors());
app.use(bodyparser.json()); // for parsing application/json
app.use(bodyparser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(4250);

// Routes
app.get('/', (req, res) => {
    res.status(200).send('hi');
})

app.get('/updated', (req, res) => {
    res.status(200).send('AMERICAN LANGUAGE ONLINE backend file updated');
})

app.post('/captcha/verify', (req, res) => {
    request.get('https://www.google.com/recaptcha/api/siteverify?response=' + req.body.token + '&secret=' + env['captchaKey'], (error, response, body) => {
        if (error) {
            console.log(error)
            res.status(error.statusCode).send(error.error);
        } else {
            res.status(response.statusCode).send(body);
        }
    })
})

app.post('/metadata/:id', (req, res) => {
    // login().then((login) => {
    //     console.log(login);
    console.log(req.body, req.params.id);
    // })
})

function mailData(req) {
    return {
        ...req.body.data,
        /*--------------------------------------------------------------------*/
        date: new Date().toLocaleString(),
        hooman: req.body.hooman ? req.body.hooman : '',
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        browser: req.header('User-agent'),
        host: req.header('Referer'),
        token: jwt.sign({
            hooman: req.body.hooman ? req.body.hooman : '',
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            browser: req.header('User-agent'),
            host: req.header('Referer')
        }, 'ALA51')
    }
}

app.post('/mail/send', (req, res) => {
    let maildata = mailData(req);
    if (maildata.message && maildata.message.length > 0 && !maildata.message.includes("http")) { // Basic check if the text contains a link
        if (maildata.hooman >= 0.65) {
            var toEmail = "contact@americanlanguage.es,ala@americanlanguage.es";
        } else if (maildata.hooman >= 0.5 || maildata.hooman < 0.65) {
            var toEmail = "ala@americanlanguage.es";
        } else {
            var toEmail = "blackhole@americanlanguage.es";
        }

        let mail = {
            headers: {
                "MIME-Version": "1.0",
                "Content-Type": "text/html",
                "Charset": "UTF-8",
                "Content-Transfer-Encoding": "8bit"
            },
            from: "Formulario de contacto <" + env['mail_username'] + ">",
            to: toEmail,
            cc: "it@americanlanguage.es",
            bcc: 'blackhole@americanlanguage.es',
            replyTo: maildata.email,
            subject: 'Formulario de contacto desde American Language Academy',
            html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
                '<h2>Formulario de contacto desde American Language Academy</h2>' +
                '<p>Enviado el ' + maildata.date + '</p>' +
                '<hr />' +
                '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
                '<p>Apellidos: <strong>' + maildata.surname + '</strong></p>' +
                '<p>Email: <strong>' + maildata.email + '</strong></p>' +
                '<p>Teléfono: <strong>' + maildata.phone + '</strong></p>' +
                '<p>Curso seleccionado: <strong>' + maildata.selectedCourse + '</strong></p>' +
                '<p>Consulta: <strong>' + maildata.message + '</strong></p>' +
                '<hr />' +
                '<h6>' + maildata.token + '</h6>' +
                '</body></html>'
        };

        let clientMail = {
            from: "American Language Academy <" + env['mail_username'] + ">",
            to: maildata.email,
            replyTo: 'ala@americanlanguage.es',
            cc: 'it@americanlanguage.es',
            bcc: 'blackhole@americanlanguage.es',
            subject: 'Programas de inglés en American Language Academy',
            text: 'Gracias por ponerte en contacto con nosotros\n' +
                'Muchas gracias por ponerte en contacto con nosotros.\n' +
                'Estamos tramitando su solicitud, \n' +
                'recibirás una respueta a la mayor brevedad posible.\n' +
                'Muchas gracias, ' + maildata.name,
            html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Document</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03a9f4;}.blue-background{background-color: #03a9f4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%; font-size: 22px;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.main-footer{color: white;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}/* CUSTOM STYLES */ .p-content{font-size: 24px;}@media screen and (max-width: 768px){p{font-size: 24px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <h1>¡Gracias por ponerte en contacto con nosotros!</h1> <p class="p-content"> Nuestro equipo pedagógico está revisanto tu solicitud y te responderán con la mayor brevedad posible. <br><br>Muchas gracias. </p></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" height="100" style="width:100px; height:100px;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
        }


        transporter.sendMail(mail, function (err, info) {
            if (err) {
                res.status(406).send(err);
            } else {
                res.status(200).send('OK');
            }
        });

        transporter.sendMail(clientMail, function (err, info) {
            if (err) {
                res.status(406).send(err);
            } else {
                res.status(200).send('OK');
            }
        });
    } else {
        res.status(412);
        console.error('Email not sent due to empty message field');
    }
});

app.post('/mail/appointment', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'ala@americanlanguage.es',
        replyTo: maildata.email,
        subject: 'Solicitud de prueba de nivel',
        bcc: 'blackhole@americanlanguage.es',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Solicitud de prueba de nivel</h2>' +
            '<p>Enviado el ' + maildata.date + '</p>' +
            '<hr />' +
            '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
            '<p>Apellidos: <strong>' + maildata.surname + '</strong></p>' +
            '<p>Email: <strong>' + maildata.email + '</strong></p>' +
            '<p>Telefono: <strong>' + maildata.phone + '</strong></p>' +
            '<p>Fecha: <strong>' + maildata.fecha + '</strong></p>' +
            '<p>Hora: <strong>' + maildata.hora + '</strong></p>' +
            '<p>Mensaje: <strong>' + maildata.message + '</strong></p>' +
            '<hr />' +
            '</body></html>'
    };

    let metaMail = {
        from: env['mail_username'],
        to: 'it@americanlanguage.es,contact@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'events@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Solicitud de prueba de nivel',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Solicitud de prueba de nivel</h2>' +
            '<p>Enviado el ' + maildata.date + '</p>' +
            '<hr />' +
            '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
            '<p>Apellidos: <strong>' + maildata.surname + '</strong></p>' +
            '<p>Email: <strong>' + maildata.email + '</strong></p>' +
            '<p>Telefono: <strong>' + maildata.phone + '</strong></p>' +
            '<p>Fecha: <strong>' + maildata.fecha + '</strong></p>' +
            '<p>Hora: <strong>' + maildata.hora + '</strong></p>' +
            '<p>Mensaje: <strong>' + maildata.message + '</strong></p>' +
            '<hr />' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '<hr />' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        // replyTo: 'ala@americanlanguage.es',
        replyTo: env['mail_username'],
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Gracias por ponerte en contacto con nosotros',
        // html : '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Level Test Mail</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white; width: 600px; padding-top: 20px;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.indigo{color: #3F51B5;}.red, .red a{color: #ef4438;}.ala-blue{color: #133D68;}.light-blue{color: #03A9F4;}.cyan{color: #00BCD4;}.teal{color: #009688;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.deep-purple{color: #7E57C2;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}.activities-path, .appointment-data{border: 1px solid #133D68; border-radius: 10px;}.appointment-data{width: 50%; padding: 5px 15px;}.phone-btn{margin: 20px auto; text-align: center; border: none; border-radius: 10px; background-color: #FF9800; padding: 10px;}.phone-btn a{text-decoration: none; color: white; font-size: 18px;}.rrss-link{margin: 0 10px;}.rrss-link, .rrss-link img{width: 30px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2 class="text-center">Tu prueba de nivel</h2> <p>Gracias por tu interés en American Language Academy, <strong>te esperamos para tu prueba de nivel</strong>. A continuación, te detallamos los datos de tu cita:</p></td></tr><tr> <td class="appointment-data"> <p><strong>Fecha: </strong>' + maildata.fecha + '</p><p><strong>Hora: </strong>' + maildata.hora + '</p><p><strong>Lugar: </strong>Plaza Conde Valle Suchil, 17</p></td></tr><tr> <td> <p>Si tienes alguna otra consulta, no dudes en contactar con alguno de nuestros asesores llamando al <a href="tel:914455511">91 455 55 11</a>.</p><p>En caso de no poder asistir, por favor responde a este e-mail con más de 24 horas de antelación.</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><!-- <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td>--> <td> <table> <tr> <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr><tr> <td> <table> <tr> <td> <a class="rrss-link" target="_blank" href="https://www.facebook.com/AmericanLanguageAcademySpain/?ref=bookmarks"> <img width="30" src="https://old.americanlanguage.es/images/mailing/Facebook_Logo.png" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://twitter.com/ALAprograms"> <img width="30" src="https://www.americanlanguage.es/assets/images/icons/twitter-icon.jpg" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://www.linkedin.com/in/john-smith-0253a6a4/"> <img width="30" src="https://old.americanlanguage.es/images/mailing/LinkedIn-Logo.png" alt=""> </a> </td></tr></table> </td></tr></table> </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
        html : '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Level Test Mail</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white; width: 600px; padding-top: 20px;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.indigo{color: #3F51B5;}.red, .red a{color: #ef4438;}.ala-blue{color: #133D68;}.light-blue{color: #03A9F4;}.cyan{color: #00BCD4;}.teal{color: #009688;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.deep-purple{color: #7E57C2;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}.activities-path, .appointment-data{border: 1px solid #133D68; border-radius: 10px;}.appointment-data{width: 50%; padding: 5px 15px;}.phone-btn{margin: 20px auto; text-align: center; border: none; border-radius: 10px; background-color: #FF9800; padding: 10px;}.phone-btn a{text-decoration: none; color: white; font-size: 18px;}.rrss-link{margin: 0 10px;}.rrss-link, .rrss-link img{width: 30px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2 class="text-center">Tu prueba de nivel</h2> <p>Gracias por tu interés en American Language Academy, <strong>te esperamos para tu prueba de nivel</strong>. A continuación, te detallamos los datos de tu cita:</p></td></tr><tr> <td class="appointment-data"> <p><strong>Fecha: </strong>' + maildata.fecha + '</p><p><strong>Hora: </strong>' + maildata.hora + '</p><p><strong>Cómo: </strong>Contacta con nosotros llamando al 91 445 55 11</p></td></tr><tr> <td> <p>Si tienes alguna otra consulta, no dudes en contactar con alguno de nuestros asesores llamando al <a href="tel:914455511">91 455 55 11</a>.</p><p>En caso de no poder realizarla, por favor responde a este e-mail con más de 24 horas de antelación.</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><!-- <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td>--> <td> <table> <tr> <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr><tr> <td> <table> <tr> <td> <a class="rrss-link" target="_blank" href="https://www.facebook.com/AmericanLanguageAcademySpain/?ref=bookmarks"> <img width="30" src="https://old.americanlanguage.es/images/mailing/Facebook_Logo.png" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://twitter.com/ALAprograms"> <img width="30" src="https://www.americanlanguage.es/assets/images/icons/twitter-icon.jpg" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://www.linkedin.com/in/john-smith-0253a6a4/"> <img width="30" src="https://old.americanlanguage.es/images/mailing/LinkedIn-Logo.png" alt=""> </a> </td></tr></table> </td></tr></table> </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(metaMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

});

app.post('/mail/company', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alaprograms@americanlanguage.es, consulting@americanlanguage.es',
        replyTo: maildata.email,
        subject: 'Contacto de Empresa',
        bcc: 'blackhole@americanlanguage.es',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Contacto de Empresa</h2>' +
            '<p>Enviado el ' + maildata.date + '</p>' +
            '<hr />' +
            '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
            '<p>Nombre de la empresa: <strong>' + maildata.companyName + '</strong></p>' +
            '<p>Email: <strong>' + maildata.email + '</strong></p>' +
            '<p>Telefono: <strong>' + maildata.phone + '</strong></p>' +
            '<p>Mensaje: <strong>' + maildata.message + '</strong></p>' +
            '<p>Preferencia de contacto: <strong>' + maildata.pref + '</strong></p>' +
            '<p>Como quiere las clases? <strong>' + maildata.how + '</strong></p>' +
            '<p>Cuantos alumnos? <strong>' + maildata.howMany + '</strong></p>' +
            '<p>En donde? <strong>' + maildata.place + '</strong></p>' +
            '<hr />' +
            '</body></html>'
    };

    let metaMail = {
        from: env['mail_username'],
        to: 'it@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'companies@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Contacto de Empresa',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Contacto de Empresa</h2>' +
            '<p>Enviado el ' + maildata.date + '</p>' +
            '<hr />' +
            '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
            '<p>Nombre de la empresa: <strong>' + maildata.companyName + '</strong></p>' +
            '<p>Email: <strong>' + maildata.email + '</strong></p>' +
            '<p>Telefono: <strong>' + maildata.phone + '</strong></p>' +
            '<p>Mensaje: <strong>' + maildata.message + '</strong></p>' +
            '<p>Preferencia de contacto: <strong>' + maildata.pref + '</strong></p>' +
            '<p>Como quiere las clases? <strong>' + maildata.how + '</strong></p>' +
            '<p>Cuantos alumnos? <strong>' + maildata.howMany + '</strong></p>' +
            '<p>En donde? <strong>' + maildata.place + '</strong></p>' +
            '<hr />' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '<hr />' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'consulting@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Formación de Inglés | American Language Academy',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Facebook Mail</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white; width: 600px; padding-top: 20px;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.indigo{color: #3F51B5;}.red, .red a{color: #ef4438;}.ala-blue{color: #133D68;}.light-blue{color: #03A9F4;}.cyan{color: #00BCD4;}.teal{color: #009688;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.deep-purple{color: #7E57C2;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}.activities-path{border: 1px solid #133D68; border-radius: 10px;}.phone-btn{margin: 20px auto; text-align: center; border: none; border-radius: 10px; background-color: #FF9800; padding: 10px;}.phone-btn a{text-decoration: none; color: white; font-size: 18px;}.rrss-link{margin: 0 10px;}.rrss-link, .rrss-link img{width: 30px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>Hola, ' + maildata.name + '</h2> <p>Nos alegramos de que hayas contactado con nosotros para informarte sobre nuestra formación en inglés para empresas.</p><p>Estamos analizando tu solicitud para darte una respuesta a la mayor brevedad posible.</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><!-- <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td>--> <td> <table> <tr> <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr><tr> <td> <table> <tr> <td> <a class="rrss-link" target="_blank" href="https://www.facebook.com/AmericanLanguageAcademySpain/?ref=bookmarks"> <img width="30" src="https://old.americanlanguage.es/images/mailing/Facebook_Logo.png" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://twitter.com/ALAprograms"> <img width="30" src="https://www.americanlanguage.es/assets/images/icons/twitter-icon.jpg" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://www.linkedin.com/in/john-smith-0253a6a4/"> <img width="30" src="https://old.americanlanguage.es/images/mailing/LinkedIn-Logo.png" alt=""> </a> </td></tr></table> </td></tr></table> </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(metaMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

});

app.post('/mail/draw', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alaprograms@americanlanguage.es,ala@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Se ha encontrado un solete ALA',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>ALA Summer Challenge</h2>' +
            '<p>Alguien ha encontrado un solete. ¡Buen verano!</p>' +
            '<hr />' +
            '<p>Nombre: ' + maildata.name + '</p>' +
            '<p>Email: ' + maildata.email + '</p>' +
            '<p>Teléfono: ' + maildata.phone + '</p>' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            // '<p>Referral: ' + maildata.referral + '</p>' +
            '<p>¿Cómo ha accedido a la web?: ' + maildata.method + '</p>' +
            '<p>Keywords: ' + maildata.keywords + '</p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'ala@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: '¡Enhorabuena! ¡Has encontrado un sol ALA!',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Gracias por participar en el sorteo</title> <script defer src="https://use.fontawesome.com/releases/v5.6.3/js/all.js" integrity="sha384-EIHISlAOj4zgYieurP0SdoiBYfGJKkgWedPHH4jCzpCXLmzVsw1ouK59MuUtP4a1" crossorigin="anonymous"></script> <style>body{padding: 0; margin: 0; font-family: Verdana, Geneva, Tahoma, sans-serif;}img{width: 100%; height: auto;}h2, p{color: #133D68;}p{font-size: 20px;}a{text-decoration: none; font-weight: bold;}.mail-container{max-width: 1200px; margin: auto;}.mail-content{box-sizing: border-box; padding: 20px;}.sun-container{margin: auto; width: 100px;}.logo-footer{width: 60%; margin: auto;}@media screen and (min-width: 769px){.sun-container{width: 200px;}.logo-footer{width: 40%;}}</style></head><body> <div class="mail-container"> <header> <img src="https://www.americanlanguage.es/assets/images/mails/header-mail.jpg" alt=""> </header> <div class="mail-content"> <h2>¡Enhorabuena! ¡Has encontrado un sol ALA!</h2> <p>Hola, ' + maildata.name + '</p><p>Este sol significa que has entrado en el sorteo <a href="https://www.americanlanguage.es/summer-challenge" target="_blank">#ALASummerChallenge</a> de American Language Academy!</p><div class="sun-container"> <img src="https://www.americanlanguage.es/assets/images/icons/sun-solid.png" alt="Solete "> </div><p>Recuerda que, cuanto más participes, ¡más oportunidades tienes de ganar!</p><p>Para más información, <a href="https://www.americanlanguage.es/summer-challenge" target="_blank">consulta las bases del concurso.</a></p><p>¡Mucha suerte!</p><p>El equipo de American Language Academy.</p></div><footer> <div class="logo-footer"> <img src="https://www.americanlanguage.es/assets/images/logos/Your-best-learning-experience.png" alt=""> </div></footer> </div></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/horse-game', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: 'ala@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Nuevo participante #ALACulturalGame',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>ALA Cultural Game</h2>' +
            '<p>Alguien se ha inscrito en el Ala Cultural Game</p>' +
            '<hr />' +
            '<p>Nombre: ' + maildata.name + '</p>' +
            '<p>Email: ' + maildata.email + '</p>' +
            '<p>Teléfono: ' + maildata.phone + '</p>' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            // '<p>Referral: ' + maildata.referral + '</p>' +
            '<p>¿Cómo ha accedido a la web?: ' + maildata.method + '</p>' +
            '<p>Keywords: ' + maildata.keywords + '</p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'it@americanlanguage.es',
        cc: 'it@americanlanguage.es, design@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: '¡Bienvenido al #ALACulturalGame!',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Companies mail</title> <style>body{margin: 0; padding: 0; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #133D68;}p{font-size: 18px;}img{width: 100%; height: auto;}h2{color: #133D68;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.mail-container{max-width: 1200px; margin: auto;}.mail-content{padding: 20px; box-sizing: border-box;}.horse-container{margin: auto; width: 100px;}.logo-footer{width: 60%; margin: auto;}@media screen and (min-width: 769px){.logo-footer{width: 40%;}.horse-container{width: 200px;}}</style></head><body> <div class="mail-container"> <header> <img src="https://www.americanlanguage.es/assets/images/mails/header-mail.jpg" alt=""> </header> <div class="mail-content"> <h2>¡Hola, ' + maildata.name + '!</h2> <p>Acabas de convertirte en participante del concurso #ALACulturalGame. Podrás ganar increíbles premios como una SmartTV o un patinete eléctrico, entre otras muchas cosas.</p><div class="horse-container"> <img src="https://www.americanlanguage.es/assets/images/icons/horse-icon.png" alt="Solete "> </div><p>De ahora en adelante, no hace falta que rellenes el apartado del nombre en el formulario, con el email y el teléfono será suficiente.</p><p>El teléfono actuará a modo de contraseña para futuros inicios de sesión.</p><div class="credentials-data"> <p class="date"><strong>Email: </strong>' + maildata.email + '</p><p class="time"><strong>Contraseña: </strong>' + maildata.phone + '</p></div><p>¡Muchas gracias!</p><p><strong>El equipo de American Language Academy</strong></p></div><footer> <div class="logo-footer"> <img src="https://www.americanlanguage.es/assets/images/logos/Your-best-learning-experience.png" alt=""> </div></footer> </div></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/usa-flag-game', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: 'ala@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Nuevo participante #ALAFallChallenge',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>ALA Fall Challenge</h2>' +
            '<p>Alguien se ha inscrito en el Ala Fall Challenge</p>' +
            '<hr />' +
            '<p>Nombre: ' + maildata.name + '</p>' +
            '<p>Email: ' + maildata.email + '</p>' +
            '<p>Teléfono: ' + maildata.phone + '</p>' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'it@americanlanguage.es',
        cc: 'it@americanlanguage.es, design@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: '¡Bienvenido al #ALAFallChallenge!',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Flag Player</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.red, .red a{color: #ef4438;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>¡Hola, ' + maildata.name + '!</h2> <p>Acabas de convertirte en participante del concurso <strong>#ALAFallGame</strong>. Podrás ganar increíbles premios como una SmartTV o un patinete eléctrico, entre otras muchas cosas.</p></td></tr><tr> <td class="horse-container"> <img width="100" src="https://www.americanlanguage.es/assets/images/icons/usa-flag.png" alt="Solete "> <img width="100" src="https://www.americanlanguage.es/assets/images/icons/flag-esp-solid.png" alt="Bandera de España"> </td></tr><tr> <td> <p>De ahora en adelante, el teléfono actuará a modo de contraseña para futuros inicios de sesión.</p></td></tr><tr> <td class="credentials-data"> <p class="date"><strong>Email: </strong>' + maildata.email + '</p><p class="time"><strong>Contraseña: </strong>' + maildata.phone + '</p></td></tr><tr> <td> <p>¡Tenemos <strong>15 premios</strong> para repartir!</p></td></tr><tr> <td> <p>!Mucha suerte!</p><p><strong>El equipo de American Language Academy</strong></p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/book-multimedia', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alatraining@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Alguien ha reservado un ordenador en la sala multimedia',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>ALA Cultural Game</h2>' +
            '<p>Alguien ha reservado un ordenador en la sala multimedia</p>' +
            '<hr />' +
            '<p>Nombre: ' + maildata.name + '</p>' +
            '<p>Fecha: ' + maildata.dateBooking + '</p>' +
            '<p>Hora de la reserva: ' + maildata.startBooking + '</p>' +
            '<p>Hora de fin: ' + maildata.endBooking + '</p>' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'it@americanlanguage.es',
        cc: 'it@americanlanguage.es, design@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Has reservado un ordenador en la sala multimedia',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Booking Multimedia Mail</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white; width: 600px; padding-top: 20px;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.indigo{color: #3F51B5;}.red, .red a{color: #ef4438;}.ala-blue{color: #133D68;}.light-blue{color: #03A9F4;}.cyan{color: #00BCD4;}.teal{color: #009688;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.deep-purple{color: #7E57C2;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}.activities-path, .appointment-data{border: 1px solid #133D68; border-radius: 10px;}.appointment-data{width: 50%; padding: 5px 15px;}.phone-btn{margin: 20px auto; text-align: center; border: none; border-radius: 10px; background-color: #FF9800; padding: 10px;}.phone-btn a{text-decoration: none; color: white; font-size: 18px;}.rrss-link{margin: 0 10px;}.rrss-link, .rrss-link img{width: 30px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>Hola, ' + maildata.name + '</h2> <p>Has reservado un ordenador en la sala multimedia el día <strong>' + maildata.dateBooking + '</strong>.</p><p>Lo tendrás disponible a partir de las <strong>' + maildata.startBooking + '</strong>.</p><p>¡Muchas gracias!</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><!-- <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td>--> <td> <table> <tr> <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr><tr> <td> <table> <tr> <td> <a class="rrss-link" target="_blank" href="https://www.facebook.com/AmericanLanguageAcademySpain/?ref=bookmarks"> <img width="30" src="https://old.americanlanguage.es/images/mailing/Facebook_Logo.png" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://twitter.com/ALAprograms"> <img width="30" src="https://www.americanlanguage.es/assets/images/icons/twitter-icon.jpg" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://www.linkedin.com/in/john-smith-0253a6a4/"> <img width="30" src="https://old.americanlanguage.es/images/mailing/LinkedIn-Logo.png" alt=""> </a> </td></tr></table> </td></tr></table> </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/inscribed-activity', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alatraining@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Alguien se ha inscrito a una actividad',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>¡Inscripción!</h2>' +
            '<p>Alguien se ha inscrito a una actividad.</p>' +
            '<hr />' +
            '<p>Nombre: ' + maildata.name + ' ' + maildata.lastname + '</p>' +
            '<p>Fecha: ' + maildata.dateEvent + '</p>' +
            '<p>Hora de la actividad: ' + maildata.timeInit + '</p>' +
            '<p>Actividad: ' + maildata.event + '</p>' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        // replyTo: 'alatraining@americanlanguage.es',
        // cc: 'it@americanlanguage.es, design@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Te has inscrito en una actividad',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Te esperamos en el Workshop</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white;}/* Custom styles */ .mail-content{margin: auto;}.logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.red, .red a{color: #ef4438;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.activity{margin: auto; text-align: center; box-sizing: border-box; border: 1px solid #414141; border-radius: 10px; padding: 20px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>Hola, ' + maildata.name + '</h2> <p>¡Te has inscrito a una actividad!</p><table class="activity"> <tr> <td><strong>' + maildata.event + '</strong></td></tr><tr> <td>' + maildata.dateEvent + ' - ' + maildata.timeInit + '</td></tr></table> <p>¡Te esperamos!</p> </td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/unsubscribe-activity', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alatraining@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Alguien se ha desapuntado de una actividad',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>¡Desapuntación!</h2>' +
            '<p>Alguien se ha desapuntado de una actividad.</p>' +
            '<hr />' +
            '<p>Nombre: ' + maildata.name + ' ' + maildata.lastname + '</p>' +
            '<p>Fecha: ' + maildata.dateEvent + '</p>' +
            '<p>Hora de la actividad: ' + maildata.timeInit + '</p>' +
            '<p>Actividad: ' + maildata.event + '</p>' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'alatraining@americanlanguage.es',
        cc: 'it@americanlanguage.es, design@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Te has desapuntado de una actividad',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Desapuntarse de actividad</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white;}/* Custom styles */ .mail-content{margin: auto;}.logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.red, .red a{color: #ef4438;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.activity{margin: auto; text-align: center; box-sizing: border-box; border: 1px solid #414141; border-radius: 10px; padding: 20px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>Hola, ' + maildata.name + '</h2> <p>Te has <strong>desapuntado</strong> de esta actividad:</p><table class="activity"> <tr> <td><strong>' + maildata.event + '</strong></td></tr><tr> <td>' + maildata.dateEvent + ' - ' + maildata.timeInit + '</td></tr></table> <p>¡Visita nuestra web para apuntarte a más <a href="https://www.americanlanguage.es/actividades-en-ingles-madrid" target="_blank">actividades en inglés</a>!</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/comment', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alaprograms@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Alguien ha comentado un post del blog',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Nuevo comentario en post del blog</h2>' +
            '<p>Alguien ha comentado un post del blog, comprueba si es apto y verifícalo en api.americanlangauge.es para que aparezca en la web</p>' +
            'La entrada corresponde a: ' +
            '<br>' +
            maildata.post +
            '<hr />' +
            maildata.comment +
            '<hr />' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'alaprograms@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Tu comentario se ha mandado a validación',
        text: 'Hola, ' + maildata.author + '\n\n' +
            'Has enviado el siguiente comentario: ' +
            maildata.comment +
            'Tu comentario se ha enviado correctamente, lo verás publicado muy pronto.\n' +
            'Cordialmente, el equipo de American Language Academy.',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Tutoría</title> <style>img{width: 100%; height: auto;}body{max-width: 1200px; padding: 0; margin: 0 auto; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #133D68; font-size: 18px; line-height: 1.5;}h1{text-align: center;}.main-content{box-sizing: border-box; padding: 20px;}.main-content .appointment-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}a{text-decoration: none; font-weight: bold; color: #133D68;}footer{padding: 20px 40px; box-sizing: border-box;}@media screen and (min-width: 769px){.logo-footer{width: 400px; margin: auto;}}</style></head><body> <header> <img src="https://www.americanlanguage.es/assets/images/mails/header-mail.jpg" alt=""> </header> <section class="main-content"> <p>Hola, ' + maildata.author + '.</p><p>Has puesto el siguiente comentario:</p><p>' + maildata.comment + '</p><p>Tu comentario se ha enviado correctamente, lo verás publicado muy pronto.</p><p>Muchas gracias por confiar en nosotros.</p><p>Cordialmente, el equipo de American Language Academy</p></section> <footer> <div class="logo-footer"> <img src="https://www.americanlanguage.es/assets/images/logos/Your-best-learning-experience.png" alt=""> </div></footer></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/tutoria', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: env['mail_username'],
        to: 'alumnos@americanlanguage.es',
        replyTo: maildata.email,
        subject: 'Alguien ha solicitado una tutoría',
        bcc: 'blackhole@americanlanguage.es',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Solicitud de tutoría desde American Language Academy</h2>' +
            // '<p>Enviado el ' + maildata.date + '</p>' +
            '<hr />' +
            '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
            '<p>Apellidos: <strong>' + maildata.surname + '</strong></p>' +
            '<p>Email: <strong>' + maildata.email + '</strong></p>' +
            '<p>Consulta: <strong>' + maildata.message + '</strong></p>' +
            '<hr />' +
            '</body></html>'
    };

    let metaMail = {
        from: env['mail_username'],
        to: 'it@americanlanguage.es',
        cc: 'calidad@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        replyTo: maildata.email,
        subject: 'Alguien ha solicitado una tutoría',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Solicitud de tutoría desde American Language Academy</h2>' +
            // '<p>Enviado el ' + maildata.date + '</p>' +
            '<hr />' +
            '<p>Nombre: <strong>' + maildata.name + '</strong></p>' +
            '<p>Apellidos: <strong>' + maildata.surname + '</strong></p>' +
            '<p>Email: <strong>' + maildata.email + '</strong></p>' +
            '<p>Consulta: <strong>' + maildata.message + '</strong></p>' +
            '<hr />' +
            'Enviado desde IP: <strong>' + maildata.ip + '</strong><br />' +
            'Navegador utilizado: <strong>' + maildata.browser + '</strong><br />' +
            'Humanidad: <strong>' + maildata.hooman + '</strong><br />' +
            'Página: <strong>' + maildata.host + '</strong><br />' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'alumnos@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Gracias por contactar con nosotros.',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Tutoria Mail</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white; width: 600px; padding-top: 20px;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.indigo{color: #3F51B5;}.red, .red a{color: #ef4438;}.ala-blue{color: #133D68;}.light-blue{color: #03A9F4;}.cyan{color: #00BCD4;}.teal{color: #009688;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.deep-purple{color: #7E57C2;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}.activities-path, .appointment-data{border: 1px solid #133D68; border-radius: 10px;}.appointment-data{width: 50%; padding: 5px 15px;}.phone-btn{margin: 20px auto; text-align: center; border: none; border-radius: 10px; background-color: #FF9800; padding: 10px;}.phone-btn a{text-decoration: none; color: white; font-size: 18px;}.rrss-link{margin: 0 10px;}.rrss-link, .rrss-link img{width: 30px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>Hola, ' + maildata.name + '</h2> <p>Has solicitado una tutoría, nuestro equipo pedagógico te dará una respuesta lo antes posible.</p><p>Muchas gracias por ponerte en contacto con nosotros.</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><!-- <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td>--> <td> <table> <tr> <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr><tr> <td> <table> <tr> <td> <a class="rrss-link" target="_blank" href="https://www.facebook.com/AmericanLanguageAcademySpain/?ref=bookmarks"> <img width="30" src="https://old.americanlanguage.es/images/mailing/Facebook_Logo.png" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://twitter.com/ALAprograms"> <img width="30" src="https://www.americanlanguage.es/assets/images/icons/twitter-icon.jpg" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://www.linkedin.com/in/john-smith-0253a6a4/"> <img width="30" src="https://old.americanlanguage.es/images/mailing/LinkedIn-Logo.png" alt=""> </a> </td></tr></table> </td></tr></table> </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(metaMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/game-letter', (req, res) => {
    let maildata = mailData(req);

    let mail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: 'calidad@americanlanguage.es',
        replyTo: maildata.email,
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Alguien ha ganado una camiseta',
        html: '<html xmlns="https://www.w3.org/1999/xhtml/" xml:lang="es" lang="es"><body>' +
            '<h2>Nueva camiseta que regalar</h2>' +
            '<p>Le hemos regalado una camiseta a alguien que ha cumplido el juego de la web.</p>' +
            '<br>' +
            '<hr />' +
            '<p>Humanidad: <strong>' + maildata.hooman + '</strong></p>' +
            '<p>IP: <strong>' + maildata.ip + '</strong></p>' +
            '<p>Explorador: <strong>' + maildata.browser + '</strong></p>' +
            '<p>Página: <strong>' + maildata.host + '</strong></p>' +
            '</body></html>'
    };

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'alaprograms@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: '¡Enhorabuena! Has ganado una camiseta ALA',
        text: 'Hola, \n\n' +
            'Has ganado una camiseta ALA' +
            '¡Enhorabuena!\n' +
            'Cordialmente, el equipo de American Language Academy.',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>New Game Letter Mail</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03A9F4;}.blue-background{background-color: #03A9F4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.thumbnail-container{width: 90%; max-width: 540px; margin: 20px auto;}.main-footer{color: white; width: 600px; padding-top: 20px;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}.green, .green a{color: #2bb673;}.indigo{color: #3F51B5;}.red, .red a{color: #ef4438;}.ala-blue{color: #133D68;}.light-blue{color: #03A9F4;}.cyan{color: #00BCD4;}.teal{color: #009688;}.blue{color: #03A9F4;}.purple{color: #9C27B0;}.deep-purple{color: #7E57C2;}.yellow{color: #FFC107;}.text-small{font-size: .8em;}.subtitle{margin-bottom: 5px;}.no-margin-top{margin-top: 5px;}.credentials-data{box-sizing: border-box; padding: 10px 20px; border: 1px solid #133D68; border-radius: 10px; width: 90%; margin: auto;}.horse-container{margin: auto; width: 50%; text-align: center;}.horse-container img{width: 100px; margin: auto 20px;}.activities-path, .appointment-data{border: 1px solid #133D68; border-radius: 10px;}.appointment-data{width: 50%; padding: 5px 15px;}.phone-btn{margin: 20px auto; text-align: center; border: none; border-radius: 10px; background-color: #FF9800; padding: 10px;}.phone-btn a{text-decoration: none; color: white; font-size: 18px;}.rrss-link{margin: 0 10px;}.rrss-link, .rrss-link img{width: 30px;}@media screen and (max-width: 768px){p{font-size: 18px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> <table class="mail-content"> <tr> <td> <h2>¡Hola!</h2> <p>¡Has ganado una camiseta ALA!</p><p>Puedes enseñar este email en recepción y conseguirás tu premio.</p><p>Esperamos que te haya servido el juego.</p><p>¡Muchas gracias!</p></td></tr></table> <table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" style="width:100px; height:auto;"> </td><!-- <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td>--> <td> <table> <tr> <td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr><tr> <td> <table> <tr> <td> <a class="rrss-link" target="_blank" href="https://www.facebook.com/AmericanLanguageAcademySpain/?ref=bookmarks"> <img width="30" src="https://old.americanlanguage.es/images/mailing/Facebook_Logo.png" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://twitter.com/ALAprograms"> <img width="30" src="https://www.americanlanguage.es/assets/images/icons/twitter-icon.jpg" alt=""> </a> </td><td> <a class="rrss-link" target="_blank" href="https://www.linkedin.com/in/john-smith-0253a6a4/"> <img width="30" src="https://old.americanlanguage.es/images/mailing/LinkedIn-Logo.png" alt=""> </a> </td></tr></table> </td></tr></table> </td></tr></table> <table> <tr> <td> <img src="https://www.americanlanguage.es/assets/images/academies/equipo-american-language-academy-rec2.jpg" width="540" alt=""> </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(mail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

function auth(req, res, next) {
    if (token && new Date() > new Date(parseInt(jwt_decode(token)['exp']) * 1000) || !token) {
        let data = {
            "identifier": env['apiUser'],
            "password": env['apiPass']
            // "code": env['captchaKey']
        }
        request.post({
            headers: { 'content-type': 'application/json' },
            url: env['apiURL'] + "/auth/local",
            body: JSON.stringify(data)
        }, (error, response, body) => {
            if (error) {
                console.error(error);
            }
            if (response) {
                token = JSON.parse(body)['jwt'];
                next();
            }
        })
    } else {
        next();
    }
}

app.put('/events/:id', auth, (req, res) => {
    request({
        url: env['apiURL'] + '/events/' + req.params.id,
        method: 'PUT',
        json: {
            "Alumnos inscritos": req.body.alumnos
        },
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, function (error, response, body) {
        if (error) {
            console.error(error)
            res.status(error.statusCode).send(error.body);
        }
        if (response) {
            res.status(response.statusCode).send(body);
        }
    })
})

app.put('/sorteos/:id', auth, (req, res) => {
    request({
        url: env['apiURL'] + '/sorteos/' + req.params.id,
        method: 'PUT',
        json: {
            "Premiados": req.body.premiados,
            "Counter": req.body.counter
        },
        headers: {
            "Authorization": "Bearer " + token
        }
    }, function (error, response, body) {
        if (error) {
            console.error(error)
            res.status(error.statusCode).send(error.body);
        }
        if (response) {
            res.status(response.statusCode).send(body);
        }
    })
});

app.get('/get-user-data', (req, res) => {
    const userData = {
        date: new Date().toLocaleString(),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        browser: req.header('User-agent')
    }
    return res.status(200).send(userData);
});

app.post('/checkout', async (req, res) => {
    const customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    });
    
    const charge = await stripe.charges.create({
      amount: req.body.stripeAmount * 100,
      currency: 'eur',
      customer: customer.id,
    //   locale: "auto",
      description: req.body.stripeDescription 
    });

    if (res.statusCode == 200 && charge.id) {
        res.status(200).send('OK');
    } else {
        res.status(406).send('Error al realizarse el pago');
    }
});

app.get('/env', (req, res) => {
    console.log("lkajsdlkasjdklasd");
    res.status(200).send('OK');
})

app.get('/get-user-participation', (req, res) => {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    const strDate = [year, month, day].join('-');
    
    const userAgent = req.header('User-agent');
    const currentDevice = deviceDetector.parse(userAgent);
    let userDevice = "";

    if (currentDevice.device.type == 'desktop') {
        userDevice = "desktop"
    } else if (currentDevice.device.type == 'smartphone') {
        userDevice = currentDevice.device.brand + " " + currentDevice.device.model;
    }

    const userData = {
        date: strDate,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        device: userDevice
    }

    return res.status(200).send(userData);
});

// ====================================================
// ======================== IMAP ======================
// ====================================================

var imap = new Imap({
    user: 'it@americanlanguage.es',
    password: 'Yzi5*8x6',
    host: 'mail.americanlanguage.es',
    port: 993,
    tls: true
});
Promise.promisifyAll(imap);

let mailIndexes = [];
app.get('/get-emails', async (req, res) => {
    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }
    imap.once('ready', function () {
        openInbox(function (err, box) {
            if (err) throw err;
            imap.search([['SUBJECT', 'Se ha encontrado un solete ALA'], ['SINCE', 'June 7, 2019']], function (err, results) {
                if (err) throw err;
                var f = imap.fetch(results, { bodies: '' });
                f.on('message', processMessage);
                f.once('error', function (err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });
    imap.once('error', function (err) {
        console.log(err);
    });
    imap.once('end', function () {
        res.status(200);
        // console.log(mailIndexes.length)
        console.log('Connection ended');
    });
    imap.connect();
});

// 'name'
// 'email'
// 'phone'
// 'humanity'
// 'referral'
// 'ip'
// 'device'
// 'page'
// 'date'

app.get('/get-email-data', async (req, res) => {
    winners = [];
    stars = [];
    metadata = [];
    mailIndexes.forEach(mail => {
        console.log(mail.email)
        let pos = winners.indexOf(mail.email);
        if (mail.humanity > 0.0){
            if (pos >= 0){
                stars[pos]++;
            } else {
                winners.push(mail.email);
                stars.push(1);
                metadata.push(mail);
            }
        }
    })
    var response = []
    winners.forEach((winner, i) => {
        response.push({
            'name': metadata[i].name,
            'stars': stars[i],
            'winner': winner,
            'phone': metadata[i].phone
        })
    })
    return res.status(200).send(response);
});


function processMessage(msg, seqno) {

    msg.once("end", function () {
        // console.log("Finished msg #" + seqno);
    });
    msg.on("body", function (stream) {
        simpleParser(stream, (err, parsed) => {

            let mail = parsed.html;

            // Get the name
            let name = mail.split('<p>Nombre: ')[1];
            name = (name) ? name.split('</p>')[0] : 'NO NAME';

            // Get the email
            let email = mail.split('<p>Email: ')[1];
            email = (email) ? email.split('</p>')[0] : 'NO EMAIL';

            // Get the phone
            let phone = mail.split('<p>Teléfono: ')[1];
            phone = (phone) ? phone.split('</p>')[0] : 'NO PHONE';

            // Get the humanity
            let humanity = mail.split('<p>Humanidad: <strong>')[1];
            humanity = (humanity) ? humanity.split('</strong>')[0] : 'NOT HUMAN';

            // Get the referral
            let referral = mail.split('<p>Referral: ')[1];
            referral = (referral) ? referral.split('</p>')[0] : 'NO REFERRAL';
            if (referral.length < 2) {
                referral = 'NO REFERRAL';
            }

            // Get the IP Address
            let ip = mail.split('<p>IP: <strong>')[1];
            ip = (ip) ? ip.split('</strong>')[0] : 'NO IP';

            // Get the device
            let device = mail.split('<p>Explorador: <strong>')[1];
            device = (device) ? device.split('</strong>')[0] : 'NO DEVICE, MATE';

            // Get the page where the user found the star
            let page = mail.split('<p>Página: <strong>')[1];
            page = (page) ? page.split('</strong>')[0] : 'NOT PAGE';

            const winner = {
                'name': name,
                'email': email,
                'phone': phone,
                'humanity': humanity,
                'referral': referral,
                'ip': ip,
                'device': device,
                'page': page,
                'date': parsed.date
            }
            mailIndexes.push(winner);
        });
    });
}

app.post('/mail/sorteo2020', (req, res) => {
    let maildata = mailData(req);

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.email,
        replyTo: 'ala@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Has encontrado un nuevo Sol, ¡Enhorabuena!',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Document</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03a9f4;}.blue-background{background-color: #03a9f4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%; font-size: 22px;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.main-footer{color: white;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}/* CUSTOM STYLES */ .p-content{font-size: 24px;}@media screen and (max-width: 768px){p{font-size: 24px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> '+
                    '<p>Hola ' + maildata.Nombre + '</p>'+
                    '<p>¡Enhorabuena! Has encontrado <strong>tu primer Sol</strong>.' +
                    '<p>Recuerda que puedes recolectar un máximo de 5 soles al día por dispositivo.</p>' +
                    '<p>¡<strong>Invita a tus amigos</strong> y familia a participar y <strong>sigue buscando soles</strong> para conseguir grandes premios!' +
                    '<p>La fecha límite para participar es el <strong>26 de Agosto a las 12:30</strong>.</p>' +
                    '<p>Consulta todas las bases del concurso <strong><a href = "https://www.americanlanguage.online/summer-challenge">aquí</a></strong>.</p>' +
                '<table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" height="100" style="width:100px; height:100px;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

app.post('/mail/buyCourse', (req, res) => {
    let maildata = mailData(req);

    let levelTesttt = maildata.user.levelTest
    
    let adminMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: 'ala@americanlanguage.es, contabilidad@americanlanguage.es',
        replyTo: 'ala@americanlanguage.es',
        // to: 'educabs97@gmail.com',
        // replyTo: 'educabs97@gmail.com',
        
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        // to: 'it@americanlanguage.es',
        // replyTo: 'it@americanlanguage.es',
        subject: 'Nueva plaza reservada en un curso (pago online)',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Document</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03a9f4;}.blue-background{background-color: #03a9f4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%; font-size: 22px;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.main-footer{color: white;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}/* CUSTOM STYLES */ .p-content{font-size: 24px;}@media screen and (max-width: 768px){p{font-size: 24px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> '+
                    '<p>Hola</p>'+
                    '<p>¡Un nuevo alumno ha reservado una plaza en un curso y la ha abonado online!</strong>.' +
                    '<p><strong>Datos del alumno:</strong></p>' +
                    '<div style = "margin-left: 20px;">'+
                        '<p>Nombre: ' + maildata.user.name + '</p>'+
                        '<p>Apellidos: ' + maildata.user.lastname + '</p>'+
                        '<p>Teléfono: ' + maildata.user.phoneNumber + '</p>'+
                        '<p>Email: ' + maildata.user.email + '</p>'+
                        '<p>Dirección: ' + maildata.user.address + ' (' + maildata.user.house + ')</p>'+
                        '<p>Ciudad: ' + maildata.user.city + '</p>'+
                        '<p>Provincia: ' + maildata.user.state + '</p>'+
                        '<p>País: ' + maildata.user.country + '</p>'+
                        '<p>Código Postal: ' + maildata.user['CP'] + '</p>'+
                        '<p>DNI: ' + maildata.user.dni + '</p>'+
                    '</div>' +
                    '<p><strong>Datos para la inscripción:</strong></p>' +
                    '<div style = "margin-left: 20px;">'+
                        '<p>Ya ha realizado la prueba de nivel con ALA: ' + (maildata.user.levelTest == 'No' ? 'NO' : 'SI') + '</p>'+
                        '<p>Curso comprado: ' + maildata.courseData.courseName + '</p>'+
                        '<p>Horario: ' + maildata.courseData.timetable + '</p>'+
                        '<p>Días de clase: ' + maildata.courseData.schedule + '</p>'+
                        '<p>Semana Inicio: ' + maildata.courseData.start_week +
                        '<p>Número Semanas: ' + maildata.courseData.num_weeks + '</p>'+
                        '<p>Importe pagado: ' + maildata.courseData.course_price + ' €</p>'+
                    '</div>' +
                    '<p><strong>Instrucciones administrativas:</strong></p>' +
                    '<div style = "margin-left: 20px;">'+
                        '<p>1. Verificar si el alumno existe en GALA (alumnos o contactos) o crearle</p>'+
                        '<p>Contactar con el alumno para realizar prueba de nivel (si es necesario) y confirmación oral de los datos de su curso (horario, días, instrucciones, metodología, pautas, asesoramiento)</p>'+
                        '<p style = "margin-left: 20px">a. Es posible que no haya una plaza disponible para el alumno en función de su nivel. Ofrecerle alternativas (si no le encaja, se le devuelve 100% del dinero*).</p>'+
                    '</div>' +
                    '<p><i>* Nota: En las condiciones aceptadas por el alumno para realizar la compra, se le indica que la reserva de plaza está condicionada al resultado de la prueba de nivel. Es por esto que en función de su nivel, horario escogido y tipo de curso podría no haber disponibilidad y por tanto devolverle el 100% del dinero si no quiere escoger una alternativa.</i></p>' +
                    '<p>¡Un saludo!</p>' +
                    '<p>La página web de americanlanguage.es</p>' +
                    '<p>¿Tienes sugerencias o mejoras sobre este correo? Contacta con it@americanlanguage.es</p>' +
                '<table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" height="100" style="width:100px; height:100px;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    let clientMail = {
        from: "American Language Academy <" + env['mail_username'] + ">",
        to: maildata.user.email,
        replyTo: 'ala@americanlanguage.es',
        cc: 'it@americanlanguage.es',
        bcc: 'blackhole@americanlanguage.es',
        subject: 'Has comprado un curso a través de nuestra página web',
        html: '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Document</title> <style>body{font-family: Arial, Helvetica, sans-serif; color: #414141; background-color: #03a9f4;}.blue-background{background-color: #03a9f4; width: 100%; height: 100%; margin: 0; padding: 0;}a{color: #03A9F4;}.container{width: 600px; background-color: #ffffff; border-radius: 5px; border-style: solid; border-width: 0px 1px 3px; border-color: #f0f0f0; padding: 5%;}.container-footer{border-top: 1px solid #cacaca; padding-top: 5%; margin-top: 5%; width: 100%;}.signature-50{width: 60px;}.signature-text{padding-left: 5%; font-size: 22px;}.container-table{margin: 0 auto;}.text-center{text-align: center;}.main-logo{text-align: center; padding: 5%;}.main-footer{color: white;}/* Custom styles */ .logo-container{width: 300px; margin: auto;}img{width: 100%; height: auto;}.pink, .pink a{color: #FF49B6;}/* CUSTOM STYLES */ .p-content{font-size: 24px;}@media screen and (max-width: 768px){p{font-size: 24px;}}</style></head><body> <table class="blue-background"> <tr> <td> <table class="container-table"> <tr> <td class="main-logo"> <img src="https://www.americanlanguage.es/assets/images/ALA/American_language_panoramico.png" alt="American Language Academy" width="500" style="width:500px;"> </td></tr><tr> <td class="container"> '+
                    '<p>Hola ' + maildata.user.name + '</p>'+
                    '<p>Este es un email de confirmación de que la compra de tu curso realizada a través de la página web se ha realizado con éxito.</p>' +
                    '<p>Hemos recibido los datos que has rellenado y uno de nuestros asesores se pondrá en contacto contigo a la mayor brevedad posible.</p>' +
                    '<p>Si tienes alguna consulta, no dudes en contactarnos a través de nuestro correo ala@americanlanguage.es o llamándo al 91 445 55 11</p>' +
                    '<p>¡Gracias por confiar en nosotros!</p>' +
                '<table class="container-footer"> <tr> <td class="signature-50"> <img src="https://www.americanlanguage.es/assets/images/ALA/50-years.png" alt="American Language Academy" width="100" height="100" style="width:100px; height:100px;"> </td><td class="signature-text"> Cordialmente,<br>El equipo de American Language Academy </td></tr></table> </td></tr><tr> <td class="main-footer"> </td></tr></table> </td></tr></table></body></html>'
    }

    transporter.sendMail(adminMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });

    transporter.sendMail(clientMail, function (err, info) {
        if (err) {
            res.status(406).send(err);
        } else {
            res.status(200).send('OK');
        }
    });
});

// ==================================================== 
// https://www.americanlanguage.es/mailing/feedback.php
// ====================================================

// HTML list of codes
/*
100 Continue
101 Switching Protocols
102 Processing (WebDAV; RFC 2518)
103 Early Hints (RFC 8297)

200 OK
201 Created
202 Accepted
203 Non-Authoritative Information (since HTTP/1.1)
204 No Content
205 Reset Content
206 Partial Content (RFC 7233)
207 Multi-Status (WebDAV; RFC 4918)
208 Already Reported (WebDAV; RFC 5842)

300 Multiple Choices
301 Moved Permanently
302 Found (Previously "Moved temporarily")
303 See Other (since HTTP/1.1)
304 Not Modified (RFC 7232)
305 Use Proxy (since HTTP/1.1)
306 Switch Proxy
307 Temporary Redirect (since HTTP/1.1)
308 Permanent Redirect (RFC 7538)

400 Bad Request
401 Unauthorized (RFC 7235)
402 Payment Required
403 Forbidden
404 Not Found
405 Method Not Allowed
406 Not Acceptable
407 Proxy Authentication Required (RFC 7235)
408 Request Timeout
409 Conflict
410 Gone
411 Length Required
412 Precondition Failed (RFC 7232)
413 Payload Too Large (RFC 7231)
414 URI Too Long (RFC 7231)
415 Unsupported Media Type (RFC 7231)
416 Range Not Satisfiable (RFC 7233)
417 Expectation Failed
418 I'm a teapot (RFC 2324, RFC 7168)
421 Misdirected Request (RFC 7540)
422 Unprocessable Entity (WebDAV; RFC 4918)
423 Locked (WebDAV; RFC 4918)
424 Failed Dependency (WebDAV; RFC 4918)
425 Too Early (RFC 8470)
426 Upgrade Required
428 Precondition Required (RFC 6585)
429 Too Many Requests (RFC 6585)
431 Request Header Fields Too Large (RFC 6585)
451 Unavailable For Legal Reasons (RFC 7725)

500 Internal Server Error
501 Not Implemented
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
505 HTTP Version Not Supported
506 Variant Also Negotiates (RFC 2295)
507 Insufficient Storage (WebDAV; RFC 4918)
508 Loop Detected (WebDAV; RFC 5842)
510 Not Extended (RFC 2774)
511 Network Authentication Required (RFC 6585)
*/