import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.development.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
const emailJsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;
const frontendUrl = process.env.FRONTEND_URL

if (!supabaseUrl) {
    console.error('supabaseUrl is undefined. Check your .env.local file and environment variables.');
    throw new Error('supabaseUrl is required.');
}

if (!supabaseKey) {
    console.error('supabaseKey is undefined. Check your .env.local file and environment variables.');
    throw new Error('supabaseKey is required.');
}

if (!emailJsServiceId) {
    console.error('emailJsServiceId is undefined. Check your .env.local file and environment variables.');
    throw new Error('emailJsServiceId is required.');
}

if (!emailJsTemplateId) {
    console.error('emailJsTemplateId is undefined. Check your .env.local file and environment variables.');
    throw new Error('emailJsTemplateId is required.');
}

if (!emailJsPublicKey) {
    console.error('emailJsPublicKey is undefined. Check your .env.local file and environment variables.');
    throw new Error('emailJsPublicKey is required.');
}

if (!emailJsPrivateKey) {
    console.error('emailJsPrivateKey is undefined. Check your .env.local file and environment variables.');
    throw new Error('emailJsPrivateKey is required.');
}

export const config = {
    supabaseUrl,
    supabaseKey,
    emailJsServiceId,
    emailJsTemplateId,
    emailJsPublicKey,
    emailJsPrivateKey,
    frontendUrl
};
