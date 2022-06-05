const nodemailer = require('nodemailer');

module.exports = email;

const smtpOptions = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a8251c6ab65852",
    pass: "6a5ce0d70e53ae"
  }
}

async function email({ to, subject, html, from = process.env.EMAIL_FROM }) {
  const transporter = nodemailer.createTransport(smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}
