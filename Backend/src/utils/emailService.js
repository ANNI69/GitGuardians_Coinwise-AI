import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendOTPEmail(email, otp) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Coinwise AI Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Coinwise AI Verification</h2>
                        <p>Hello,</p>
                        <p>Your verification code is:</p>
                        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
                            <strong>${otp}</strong>
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't request this code, please ignore this email.</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send verification email');
        }
    }
}

export default new EmailService(); 