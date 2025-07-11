import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export class EmailService {
  static async sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    await transporter.sendMail({
      from: 'Emertrix <no-reply@emertrix.com>',
      to,
      subject,
      html,
    });
  }
}
