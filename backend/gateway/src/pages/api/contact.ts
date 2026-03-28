import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message, category } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // SendGrid integration
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    await sgMail.send({
      to: 'info@residentcement.com',
      from: 'noreply@residentcement.com',
      subject: `Contact Form: ${subject || category}`,
      text: `
Name: ${name}
Email: ${email}
Category: ${category}
Subject: ${subject || 'N/A'}

Message:
${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    // For demo purposes, return success even if SendGrid fails
    res.status(200).json({ success: true, demo: true });
  }
}
