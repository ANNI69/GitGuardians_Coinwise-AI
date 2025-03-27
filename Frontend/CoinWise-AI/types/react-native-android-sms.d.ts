declare module 'react-native-android-sms' {
  interface SmsListOptions {
    box: 'inbox' | 'sent' | 'draft' | 'outbox' | 'failed' | 'queued';
    bodyRegex?: string;
  }

  interface SmsMessage {
    body: string;
    date: string;
  }

  const SmsAndroid: {
    list: (options: string) => Promise<SmsMessage[]>;
  };

  export default SmsAndroid;
} 