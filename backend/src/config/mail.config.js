import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export function getClient() {
  const mailgun = new Mailgun(FormData);
  const client = mailgun.client({
    username: 'api',
    key:'07ee33d71729f0c49a538e767b7ac293-556e0aa9-f4169d7a'
    //console.log("process.env.MAILGUN_API_KEY",process.env.MAILGUN_API_KEY)
    //key: process.env.MAILGUN_API_KEY,
    
  });

  return client;
}
