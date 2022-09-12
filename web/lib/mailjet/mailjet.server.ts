import Mailjet from 'node-mailjet';
import invariant from 'tiny-invariant';
import { StripeConfirmation } from '../stripe/stripe-mapper';

invariant(process.env.MAILJET_PUBLIC_KEY, 'process.env.MAILJET_PUBLIC_KEY is not defined.');
invariant(process.env.MAILJET_PRIVATE_KEY, 'process.env.MAILJET_PRIVATE_KEY is not defined.');
const client = Mailjet.apiConnect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_PRIVATE_KEY);

export const sendMail = async (confirmation: StripeConfirmation) => {
  if (confirmation.email.includes('test')) {
    return null;
  }
  try {
    const result = await client.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'espenhellerud5@gmail.com',
            Name: 'Espen',
          },
          To: [
            {
              Email: confirmation.email,
              Name: confirmation.name,
            },
          ],
          Subject: 'Purchase from Tea Commerce.',
          TextPart: 'Thanks for shopping at Tea Commerce',
          HTMLPart: `<h3>Status of your order is ${confirmation.status}</h3><br />May the delivery force be with you!`,
          CustomID: 'AppGettingStartedTest',
        },
      ],
    });
    return result;
  } catch (error: any) {
    throw new Error(`Failed to send mail.{ statusCode: ${error.statusCode} }`);
  }
};
