const express = require('express');
// const path = require('path');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let allowedOrigins = ['http://localhost:8000', process.env.ORIGIN];

app.use(cors({
    origin: function(origin, cb) {
        if(!origin) return cb(null, true);

        if(allowedOrigins.indexOf(origin === -1)) {
            let msg = 'The CORS Policy does not allow your origin';
            return cb(null, true);
        };
    }
}));

app.post('/v1/mailer', function(req, res) {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: false,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS
        }
    });
    
    transporter.verify((error, success) => {
        if(error) {
            console.log(error);
        } else {
            console.log('verified');
        }
    });
    
    mailOpts = {
        from: `"Stephen Leigh" ${process.env.EMAIL_ADDRESS}`,
        to: req.body.name + req.body.email,
        subject: 'Thank you for your Request',
        html: "<h1>Here is my CV as Promised</h1>",
        attachments: [{
            filename: 'cv.pdf',
            path: './cv/cv.pdf',
            contentType: 'application/pdf'
        }]
    };

    transporter.sendMail(mailOpts, function(err, res) {
        if(err) {
            console.log(err);
        } else {
            res.json({msg: "message sent"});
        }
    })
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`running on port ${port}`));