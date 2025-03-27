declare module 'react-native-android-notification-listener' {
  interface NotificationData {
    app: string;
    title: string;
    text: string;
    time: number;
  }

  const NotificationListener: {
    requestPermission(): Promise<boolean>;
    onNotificationReceived(callback: (notification: NotificationData) => void): void;
    stopListening(): void;
  };

  export default NotificationListener;
} 