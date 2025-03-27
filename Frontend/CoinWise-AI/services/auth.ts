// Mock implementation - replace with actual API calls to your backend

export const sendOTP = async (phoneNumber: string): Promise<void> => {
  // In a real app, this would call your backend API
  // which would then send an OTP via SMS service (Twilio, AWS SNS, etc.)
  console.log(`Mock: Sending OTP to ${phoneNumber}`);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  // In a real app, this would call your backend API to verify
  // For demo purposes, we'll just check if OTP is "123456"
  console.log(`Mock: Verifying OTP ${otp} for ${phoneNumber}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(otp === '123456'); // Mock validation
    }, 1000);
  });
};