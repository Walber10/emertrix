const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER, 
    pass: process.env.BREVO_SMTP_PASS, 
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions) {
  await transporter.sendMail({
    from: 'Emertrix <no-reply@emertrix.com>', 
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail }; 