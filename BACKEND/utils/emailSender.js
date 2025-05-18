const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // SMTP host
  port: process.env.EMAIL_PORT, // SMTP port (587 for TLS, 465 for SSL)
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'esandidesilva2003@gmail.com',
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmail;   