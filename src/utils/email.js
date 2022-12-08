var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

const Mail = (mail_address, subject, data = {}, file_name) => {
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                callback(err);
                throw err;

            }
            else {
                callback(null, html);
            }
        });
    };

    // Transport Creator From Nodemailer
    const transport = nodemailer.createTransport({
        service: "Gmail",
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    readHTMLFile(__dirname + '/../template/email/' + file_name + '.html', async function (err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(data);
        var mailOptions = {
            from: process.env.MAIL_ADDRESS,
            to: mail_address,
            subject: subject,
            html: htmlToSend
        };
        await transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
        });
    });
}

module.exports = {
    Mail
}