const nodemailer = require('nodemailer');

module.exports = email;

const smtpOptions = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "jeremie.morar70@ethereal.email",
    pass: "AR4bDZUTQF8kpq62uV"
  }
}

async function email({ to, subject, html, from = process.env.EMAIL_FROM }) {
  const transporter = nodemailer.createTransport(smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}
