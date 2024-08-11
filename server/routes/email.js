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

router.post('/send-emails', async (req, res) => {
  const { sportsUrl, carsUrl, movieUrl } = req.body;
  const batchSize = 10; // Adjust batch size based on your rate limits
  const batchDelay = 10000; // Delay in milliseconds between batches

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
    for (let i = 0; i < emails.length; i += batchSize) {
      const emailBatch = emails.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(emailBatch.map(email => 
        sendEmailWithRetry(email, emailHtmlContent)
      ));
      
      results.push(...batchResults);
      
      // Add a delay between batches to avoid hitting rate limits
      if (i + batchSize < emails.length) {
        console.log(`Waiting for ${batchDelay / 1000} seconds before sending the next batch...`);
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }
    
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