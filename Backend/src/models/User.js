const admin = require('firebase-admin');

class User {
    constructor({
        uid,
        email,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
        address,
        isVerified = 'false',
        createdAt = new Date(),
        lastLogin = new Date(),
        balance = 0,
        currency = 'USD',
        isPhoneVerified = false,
        isEmailVerified = false,
        securityQuestions = [],
        income = 0,
    }) {
        this.uid = uid;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.isVerified = verificationStatus;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.balance = balance;
        this.currency = currency;
        this.isPhoneVerified = isPhoneVerified;
        this.isEmailVerified = isEmailVerified;
        this.income = income;
    }

    // Create a new user
    static async create(userData) {
        try {
            const userRef = admin.firestore().collection('users').doc(userData.uid);
            const user = new User(userData);
            await userRef.set(user);
            return user;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Get user by ID
    static async getById(uid) {
        try {
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            if (!userDoc.exists) {
                return null;
            }
            return new User({ uid, ...userDoc.data() });
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    // Update user
    async update(updateData) {
        try {
            const userRef = admin.firestore().collection('users').doc(this.uid);
            await userRef.update(updateData);
            Object.assign(this, updateData);
            return this;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Update balance
    async updateBalance(amount, type = 'add') {
        try {
            const newBalance = type === 'add' 
                ? this.balance + amount 
                : this.balance - amount;
            
            if (newBalance < 0) {
                throw new Error('Insufficient funds');
            }

            await this.update({ balance: newBalance });
            return this;
        } catch (error) {
            throw new Error(`Error updating balance: ${error.message}`);
        }
    }

    // Verify KYC
    async verifyKYC(kycData) {
        try {
            await this.update({
                kycStatus: 'verified',
                ...kycData
            });
            return this;
        } catch (error) {
            throw new Error(`Error verifying KYC: ${error.message}`);
        }
    }

    // Disable account
    async disableAccount() {
        try {
            await this.update({ accountStatus: 'disabled' });
            return this;
        } catch (error) {
            throw new Error(`Error disabling account: ${error.message}`);
        }
    }

    // Update income
    async updateIncome(amount, type = 'add') {
        try {
            const newIncome = type === 'add' 
                ? this.income + amount 
                : this.income - amount;
            
            if (newIncome < 0) {
                throw new Error('Income cannot be negative');
            }

            await this.update({ income: newIncome });
            return this;
        } catch (error) {
            throw new Error(`Error updating income: ${error.message}`);
        }
    }

    // Set income
    async setIncome(amount) {
        try {
            if (amount < 0) {
                throw new Error('Income cannot be negative');
            }

            await this.update({ income: amount });
            return this;
        } catch (error) {
            throw new Error(`Error setting income: ${error.message}`);
        }
    }
}

module.exports = User; 