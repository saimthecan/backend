const nodemailer = require('nodemailer');

async function sendNotification(payload) {
  try {
    const subscribedUsers = await AppUser.find({ email: { $exists: true, $ne: null } });
    console.log('Abonelikleri olan kullanıcılar:', subscribedUsers);

    // Email gönderme ayarları
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    subscribedUsers.forEach((user) => {
      console.log(`Kullanıcıya bildirim gönderiliyor: ${user._id}`);

      // Email gönderme işlemi
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: payload.title,
        text: payload.message,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    });
  } catch (error) {
    console.error('Error in sendNotification:', error);
  }
}
