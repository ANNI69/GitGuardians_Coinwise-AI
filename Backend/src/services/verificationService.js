import admin from 'firebase-admin';
import emailService from '../utils/emailService.js';

class VerificationService {
    constructor() {
        this.db = admin.firestore();
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async storeOTP(uid, contact, otp, type) {
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await this.db.collection('otps').doc(uid).set({
            contact,
            otp,
            otpExpiry,
            attempts: 0,
            type // 'email' or 'phone'
        });
    }

    async sendOTP(uid, contact, type) {
        try {
            const otp = this.generateOTP();
            
            if (type === 'email') {
                await emailService.sendOTPEmail(contact, otp);
            } else if (type === 'phone') {
                // TODO: Implement SMS service
                console.log(`OTP for ${contact}: ${otp}`);
            }

            await this.storeOTP(uid, contact, otp, type);
            return true;
        } catch (error) {
            console.error(`Error sending ${type} OTP:`, error);
            throw new Error(`Failed to send ${type} OTP`);
        }
    }

    async verifyOTP(uid, otp) {
        try {
            const otpDoc = await this.db.collection('otps').doc(uid).get();
            
            if (!otpDoc.exists) {
                throw new Error('No OTP request found');
            }

            const otpData = otpDoc.data();

            // Check if OTP has expired
            if (new Date() > otpData.otpExpiry) {
                throw new Error('OTP has expired');
            }

            // Check if too many attempts
            if (otpData.attempts >= 3) {
                throw new Error('Too many failed attempts. Please request a new OTP');
            }

            // Verify OTP
            if (otp !== otpData.otp) {
                // Increment attempts
                await this.db.collection('otps').doc(uid).update({
                    attempts: admin.firestore.FieldValue.increment(1)
                });
                throw new Error('Invalid OTP');
            }

            // Delete OTP document after successful verification
            await this.db.collection('otps').doc(uid).delete();

            return {
                success: true,
                type: otpData.type,
                contact: otpData.contact
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new VerificationService(); 