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
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Failed to request notification permission:', err);
        return false;
      }
    }
    return false;
  }

  async startListening(onTransaction: (transaction: Transaction) => void) {
    if (this.isListening) return;

    try {
      const hasPermission = await NotificationListener.requestPermission();
      if (hasPermission === undefined) {
        throw new Error('Notification permission not granted');
      }

      NotificationListener.onNotificationReceived((notification: any) => {
        const transaction = this.parseTransaction(notification);
        if (transaction) {
          onTransaction(transaction);
        }
      });
      

      this.isListening = true;
    } catch (error) {
      console.error('Failed to start notification listener:', error);
    }
  }

  private parseTransaction(notification: any): Transaction | null {
    try {
      const text = notification.text || '';
      const title = notification.title || '';

      // Common patterns for transaction notifications
      const creditPattern = /(?:credited|received|credit) (?:of )?₹?(\d+(?:,\d+)*(?:\.\d{2})?)/i;
      const debitPattern = /(?:debited|spent|debit) (?:of )?₹?(\d+(?:,\d+)*(?:\.\d{2})?)/i;

      const creditMatch = text.match(creditPattern);
      const debitMatch = text.match(debitPattern);

      if (creditMatch || debitMatch) {
        const amount = parseFloat((creditMatch || debitMatch)[1].replace(/,/g, ''));
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