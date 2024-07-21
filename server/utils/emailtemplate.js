//utils/emailtemplate.js:
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { config } from '../config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateSource = fs.readFileSync(path.resolve(__dirname, '../utils/Template.html'), 'utf8');
const template = Handlebars.compile(templateSource);

export const renderEmailTemplate = (movieUrl, carUrl, sportsUrl) => {
  const context = {
    movieUrl,
    carUrl,
    sportsUrl,
    unsubscribeUrl: `${config.frontendUrl}/unsubscribe`,
  };
  return template(context);
};