const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Transporter - Taşıyıcı Oluştur
  var transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'bb7515f06b6cc5',
      pass: '6d358b6e58531d',
    },
  });

  // 2) Email'in içeriğini tanımla
  const mailOptions = {
    from: 'Furkan Evin <furkanevin00@mail.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // 3) Email'i gönder
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
