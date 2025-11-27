import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email verification
export const sendVerificationEmail = async (email, name, token) => {
  // Skip email sending in development if not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log(`⚠️  Email not configured. Skipping verification email to ${email}`);
    console.log(`📧 Verification URL (for development): ${process.env.FRONTEND_URL}/verify-email/${token}`);
    return;
  }

  const transporter = createTransporter();
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Shiksha" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email - Shiksha',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a435f0 0%, #5624d0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #a435f0; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Welcome to Shiksha!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for signing up! Please verify your email address to get started.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Shiksha. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending verification email: ${error.message}`);
    // Don't throw error in development
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send verification email');
    }
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, token) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log(`⚠️  Email not configured. Skipping password reset email to ${email}`);
    console.log(`📧 Reset URL (for development): ${process.env.FRONTEND_URL}/reset-password/${token}`);
    return;
  }

  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"Shiksha" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset Request - Shiksha',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a435f0 0%, #5624d0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #f3722c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset your password for your Shiksha account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Shiksha. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending password reset email: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send password reset email');
    }
  }
};

// Send 2FA setup email
export const send2FASetupEmail = async (email, name, backupCodes) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log(`⚠️  Email not configured. Skipping 2FA setup email to ${email}`);
    return;
  }

  const transporter = createTransporter();
  const codesHtml = backupCodes.map(code => `<li><code>${code}</code></li>`).join('');

  const mailOptions = {
    from: `"Shiksha" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Two-Factor Authentication Enabled - Shiksha',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a435f0 0%, #5624d0 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .codes { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          code { background: #e9ecef; padding: 5px 10px; border-radius: 3px; font-family: monospace; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 2FA Enabled</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Two-factor authentication has been successfully enabled on your account!</p>
            <div class="warning">
              <strong>⚠️ Important: Save Your Backup Codes</strong>
              <p>Store these backup codes in a safe place. You can use them to access your account if you lose your authentication device.</p>
            </div>
            <div class="codes">
              <h3>Your Backup Codes:</h3>
              <ul>${codesHtml}</ul>
            </div>
            <p><strong>Each code can only be used once.</strong></p>
            <p>If you didn't enable 2FA, please contact support immediately.</p>
          </div>
          <div class="footer">
            <p>© 2024 Shiksha. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ 2FA setup email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending 2FA setup email: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send 2FA setup email');
    }
  }
};
