//routes/email.js:
import express from 'express';
import emailjs from '@emailjs/nodejs';
import { supabase } from '../utils/supabaseClient.js';
import { renderEmailTemplate } from '../utils/emailtemplate.js';
import { config } from '../config.js';

const router = express.Router();

// Initialize EmailJS with your public and private keys
emailjs.init({
  publicKey: config.emailJsPublicKey,
  privateKey: config.emailJsPrivateKey
});

router.post('/send-emails', async (req, res) => {
  const { sportsUrl, carsUrl, movieUrl } = req.body;


  console.log({sportsUrl, carsUrl, movieUrl});

  // Log all environment variables
  console.log('Environment Variables:');
  console.log('EMAILJS_SERVICE_ID:', config.emailJsServiceId);
  console.log('EMAILJS_TEMPLATE_ID:', config.emailJsTemplateId);
  console.log('EMAILJS_PUBLIC_KEY:', config.emailJsPublicKey);
  console.log('EMAILJS_PRIVATE_KEY:', config.emailJsPrivateKey);

  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('email');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const emails = subscriptions.map(subscription => subscription.email);
    const emailHtmlContent = renderEmailTemplate(movieUrl, carsUrl, sportsUrl);

    const sendEmailPromises = emails.map(email => {
      return emailjs.send(
        config.emailJsServiceId,
        config.emailJsTemplateId,
        {
          to_email: email,
          html_content: emailHtmlContent
        }
      );
    });

    const results = await Promise.all(sendEmailPromises);
    
    // Log the response from EmailJS
    results.forEach((result, index) => {
      console.log(`Email ${index + 1} response:`, result);
    });

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;