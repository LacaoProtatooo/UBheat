import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'a60518cd87e9fc', // Replace with your Mailtrap username
    pass: '010eeb28124d2a', // Replace with your Mailtrap password
  },
});

export const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: 'UBheat <no-reply@ubheat.com>',
    to: email,
    subject: '🔥 Confirm Your UBheat Account! 🔥',
    text: `Welcome to UBheat! Please verify your email by clicking the link below: \n${verificationLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
        <div style="max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
          <h2 style="color: #333;">Welcome to <span style="color: #ff4500;">UBheat</span>! 🔥</h2>
          <p style="font-size: 16px; color: #555;">You're just one step away from unlocking the full experience. Click the button below to verify your email and get started.</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #ff4500; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
          <p style="font-size: 14px; color: #777;">Or copy and paste this link into your browser:</p>
          <p style="word-wrap: break-word; font-size: 14px; color: #555;">${verificationLink}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #888;">If you didn’t sign up for UBheat, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};
