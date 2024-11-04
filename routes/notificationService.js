// services/notificationService.js

const webpush = require('web-push');
const AppUser = require('../models/AppUser');

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:sco11@protonmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

console.log('Sunucuda kullanılan VAPID Public Key:', vapidKeys.publicKey);
console.log('Sunucuda kullanılan VAPID Private Key:', vapidKeys.privateKey);


async function sendNotification(payload) {
  try {
    const subscribedUsers = await AppUser.find({ pushSubscription: { $exists: true } });
    console.log('Abonelikleri olan kullanıcılar:', subscribedUsers);

    subscribedUsers.forEach((user) => {
      console.log(`Kullanıcıya bildirim gönderiliyor: ${user._id}`);
      webpush.sendNotification(user.pushSubscription, JSON.stringify(payload))
        .catch(error => {
          console.error('Error sending notification:', error);
        });
    });
  } catch (error) {
    console.error('Error in sendNotification:', error);
  }
}

module.exports = {
  sendNotification,
};
