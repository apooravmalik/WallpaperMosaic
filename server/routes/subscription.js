import express from 'express';
import { supabase } from '../utils/supabaseClient.js';

const router = express.Router();

// Subscribe endpoint
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Insert the new subscription
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({ email });

    if (insertError) {
      if (insertError.details.includes('duplicate key')) {
        return res.status(409).json({ message: 'Email already subscribed' });
      }
      return res.status(400).json({ error: insertError.message });
    }

    res.status(200).json({ message: 'Subscription successful! Please check your email.' });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});
// Unsubscribe endpoint
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.body;

  const { data, error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('email', email)
    .select(); // Ensure the query returns data

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Check if data is null or empty
  if (!data || data.length === 0) {
    return res.status(404).json({ message: 'Email not found.' });
  }

  res.status(200).json({ message: 'You have successfully unsubscribed.' });
});

router.get('/subscribers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('email');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
