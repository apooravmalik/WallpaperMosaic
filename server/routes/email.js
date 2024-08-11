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

const sendEmailWithRetry = async (email, emailHtmlContent, retries = 3, initialDelay = 1000) => {
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      const result = await emailjs.send(
        config.emailJsServiceId,
        config.emailJsTemplateId,
        {
          to_email: email,
          html_content: emailHtmlContent
        }
      );
      console.log(`Email sent successfully to ${email}`);
      return { status: 'success', result };
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${email}:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        return { status: 'failed', error: error.message };
      }
    }
  }
};

router.post('/email/send-emails', async (req, res) => {
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
    
    const results = [];
    for (const email of emails) {
      const sendResult = await sendEmailWithRetry(email, emailHtmlContent);
      results.push({ email, ...sendResult });
      // Add a delay between each email to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Log the response from EmailJS
    results.forEach((result, index) => {
      console.log(`Email ${index + 1} response:`, result);
    });
    
    const successCount = results.filter(r => r.status === 'success').length;
    res.status(200).json({ 
      message: `Emails sent successfully to ${successCount} out of ${emails.length} recipients`,
      details: results
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;