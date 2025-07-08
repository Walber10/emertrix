import express, { Request, Response } from 'express';
const { sendEmail } = require('../utils/email');

const router = express.Router();

router.post('/test-email', async (req: Request, res: Response) => {
  const { to, email } = req.body;
  const recipientEmail = to || email;
  if (!recipientEmail) {
    return res.status(400).json({ success: false, error: 'Missing "to" or "email" field' });
  }
  try {
    await sendEmail({
      to: recipientEmail,
      subject: 'Test Email from Emertrix (Brevo)',
      html: '<h2>This is a test email sent via Brevo SMTP!</h2><p>If you received this, your setup works 🎉</p>',
    });
    res.json({ success: true, message: 'Test email sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Failed to send email' });
  }
});

export default router; 