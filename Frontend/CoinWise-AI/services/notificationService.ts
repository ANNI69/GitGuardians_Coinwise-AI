import { PermissionsAndroid, Platform } from 'react-native';
import NotificationListener from 'react-native-android-notification-listener';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  bankName: string;
}

interface NotificationData {
  app: string;
  title: string;
  text: string;
  time: number;
}

class NotificationService {
  private static instance: NotificationService;
  private isListening: boolean = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        console.log('Requesting notification permission...');
        const notificationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('Notification permission result:', notificationPermission);
        
        console.log('Requesting notification listener permission...');
        const listenerPermission = await NotificationListener.requestPermission();
        console.log('Listener permission result:', listenerPermission);
        
        const isGranted = notificationPermission === PermissionsAndroid.RESULTS.GRANTED && 
               listenerPermission === true;
        console.log('Final permission status:', isGranted);
        return isGranted;
      } catch (err) {
        console.error('Failed to request notification permission:', err);
        return false;
      }
    }
    return false;
  }

  async startListening(onTransaction: (transaction: Transaction) => void) {
    if (this.isListening) {
      console.log('Already listening for notifications');
      return;
    }

    try {
      console.log('Starting notification listener...');
      const hasPermission = await this.requestPermission();
      console.log('Permission status:', hasPermission);
      
      if (!hasPermission) {
        throw new Error('Notification permission not granted');
      }

      console.log('Setting up notification listener...');
      NotificationListener.onNotificationReceived((notification: NotificationData) => {
        console.log('Raw notification received:', notification);
        const transaction = this.parseTransaction(notification);
        console.log('Parsed transaction result:', transaction);
        if (transaction) {
          console.log('Calling onTransaction callback...');
          onTransaction(transaction);
        }
      });

      this.isListening = true;
      console.log('Notification listener setup complete');
    } catch (error) {
      console.error('Failed to start notification listener:', error);
    }
  }

  private parseTransaction(notification: NotificationData): Transaction | null {
    try {
      const text = notification.text || '';
      const title = notification.title || '';

      // Common patterns for transaction notifications
      const creditPattern = /(?:credited|received|credit) (?:of )?₹?(\d+(?:,\d+)*(?:\.\d{2})?)/i;
      const debitPattern = /(?:debited|spent|debit) (?:of )?₹?(\d+(?:,\d+)*(?:\.\d{2})?)/i;

      const creditMatch = text.match(creditPattern);
      const debitMatch = text.match(debitPattern);

      if (creditMatch || debitMatch) {
        const match = creditMatch || debitMatch;
        if (!match) return null;
        const amount = parseFloat(match[1].replace(/,/g, ''));
        const type = creditMatch ? 'credit' : 'debit';
        const bankName = title.split(' ')[0] || 'Unknown Bank';

        return {
          id: Date.now().toString(),
          amount,
          type,
          description: text,
          date: new Date().toISOString(),
          bankName
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing transaction:', error);
      return null;
    }
  }

  stopListening() {
    if (this.isListening) {
      NotificationListener.stopListening();
      this.isListening = false;
    }
  }
}

export default NotificationService; 