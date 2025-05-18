const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
  console.log('Setting up email transport with:', {
    user: process.env.GMAIL_USER,
    service: 'gmail'
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    console.log('Attempting to send email with options:', {
      to,
      subject,
      from: process.env.GMAIL_USER
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
    return info;
  } catch (error) {
    console.error('Email sending error:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
}

module.exports = sendEmail;





// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const sendEmail = async ({ to, subject, text }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//       port: process.env.EMAIL_PORT || 587,
//       secure: false, // true for 465, false for 587
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: `"MistyEMS QC" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.messageId);
//   } catch (error) {
//     console.error('Email sending error:', error);
//   }
// };

// module.exports = { sendEmail };

