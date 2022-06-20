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

// email templates

const sendVerificationEmail = async (options) => {
  let message, urlHTML = null;
  if (options.origin) {
    const url = `${options.origin}/auth/verify-email?token=${options.verificationToken}`;
    message = `<p>Please click the below link to verify your email address</p>`
    urlHTML = `<div style="text-align: center; margin: 20px 0">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 15px; font-size: 14px; line-height: 1.57143; border-radius: 50px; color: #003737; background: #0feb73; text-transform: uppercase; text-decoration: none; font-weight: bold">
                ${options.linkText}
              </a>
          </div>`
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
               <p><code>${options.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: options.email,
    subject: options.subject,
    html: `
      <div style="padding: 30px; margin-right: auto; margin-left: auto">
        <div style="padding: 7px 0 5px">
          <div style="text-align: center; padding: 5px 0 5px">
              <svg class="logo" viewBox="0 0 128 128" width="64" height="64">
                  <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" />
                  <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" />
              </svg>
          </div>
          <div style="text-align: center">
              <h1>${options.title}</h1>
          </div>
          <div style="text-align: center">${message}</div>
          ${urlHTML}
          <hr style="border:0;height:0;border-top:1px solid rgba(0,0,0,0.2)">
          Thanks for registering, <br><a href="${options.origin}" target="_blank">EasyEat</a>
        </div>
      </div>`
  });
}

const sendPasswordResetEmail = async (options) => {
  let message, urlHTML = null;
  if (options.origin) {
    const url = `${options.origin}/auth/reset-password?token=${options.resetToken}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day</p>`
    urlHTML = `<div style="text-align: center; margin: 20px 0">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 15px; font-size: 14px; line-height: 1.57143; border-radius: 50px; color: #003737; background: #0feb73; text-transform: uppercase; text-decoration: none; font-weight: bold">
                ${options.linkText}
              </a>
          </div>`
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route</p>
               <p><code>${options.resetToken}</code></p>`;
  }

  await sendEmail({
    to: options.email,
    subject: options.subject,
    html: `
      <div style="padding: 30px; margin-right: auto; margin-left: auto">
        <div style="padding: 7px 0 5px">
          <div style="text-align: center; padding: 5px 0 5px">
              <svg class="logo" viewBox="0 0 128 128" width="64" height="64">
                  <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" />
                  <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" />
              </svg>
          </div>
          <div style="text-align: center">
              <h1>${options.title}</h1>
          </div>
          <div style="text-align: center">${message}</div>
          ${urlHTML}
          <hr style="border:0;height:0;border-top:1px solid rgba(0,0,0,0.2)">
          Best regards, <br><a href="${options.origin}" target="_blank">EasyEat</a>
        </div>
      </div>`
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
