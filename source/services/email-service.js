'use strict';

var configuration = require('../config');
const sendGridMailService = require('@sendgrid/mail');
sendGridMailService.setApiKey(configuration.sendGridKey);

exports.send = async (to, subject, body) => {
    try {
        const msg = {
            to: 'kserain.development@gmail.com',
            from: 'kserain.development@gmail.com',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          };
          sendGridMailService.send(msg);
        // sendGridMailService.send({
        //     to: to,
        //     from: 'kserain.development@gmail.com',
        //     subject: subject,
        //     html: body
        // });
        console.log(body);
        
    } catch (error) {
        console.log(error);
    }
}