import Stripe from 'stripe';
import { buffer } from 'micro';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

if (!admin.apps.length) {
  const { private_key } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: private_key,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    }),
  });
}

export const updateUserCredits = async (userUid, creditsToAdd) => {
  try {
    const usersRef = admin.firestore().collection('users');
    const query = usersRef.where('uid', '==', userUid);
    const querySnapshot = await query.get();

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      await userDocRef.update({ credits: admin.firestore.FieldValue.increment(creditsToAdd) });
    } else {
    }
  } catch (error) {
  }
};

async function handleWebhookEvent(req, res) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {  
        expand: ['line_items'],  
      });
      const lineItems = checkoutSession.line_items.data;
      const purchased = lineItems[0].description;
      const userUid = session.metadata.userUid;
      if (purchased.includes("5")) {
        await updateUserCredits(userUid, 5)
      } else if (purchased.includes("10")) {
        await updateUserCredits(userUid, 10)
      } else {
        await updateUserCredits(userUid, 9999)
      }
      break;

    // Add other event types to handle as needed

    default:
  }

  res.status(200).end();
}

export default handleWebhookEvent;