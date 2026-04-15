export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_DEV_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  stripe: {
    publishableKey: 'pk_test_YOUR_STRIPE_KEY',
    proPriceId: 'price_YOUR_PRICE_ID',
  },
  useEmulators: true,
};
