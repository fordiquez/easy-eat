const { createTransport } = require('nodemailer');

const smtpOptions = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}

async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {
  const transporter = createTransport(smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

// email functions

const sendAlreadyRegisteredEmail = async (email, origin) => {
  let message;
  if (origin) {
    message = `<p>If you don't know your password please visit the <a href="${origin}/auth/forgot-password">forgot password</a> page.</p>`;
  } else {
    message = `<p>If you don't know your password you can reset it via the <code>/accounts/forgot-password</code> api route.</p>`;
  }

  await sendEmail({
    to: email,
    subject: 'EasyEat — Email Already Registered',
    html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
  });
}

const sendVerificationEmail = async (account, origin) => {
  let message;
  if (origin) {
    const verifyUrl = `${origin}/auth/verify-email?token=${account.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: 'EasyEat — Verify Email',
    html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
  });
}

const sendPasswordResetEmail = async (account, origin) => {
  let message;
  if (origin) {
    const resetUrl = `${origin}/auth/reset-password?token=${account.resetToken.token}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: 'EasyEat — Reset Password',
    html: `<h4>Reset Password Email</h4>
               ${message}`
  });
}

module.exports = {
  sendAlreadyRegisteredEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};
