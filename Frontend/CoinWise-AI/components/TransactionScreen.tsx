import { AppRegistry } from 'react-native'
import NotificationListener from 'react-native-android-notification-listener';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface NotificationData {
  app: string;
  title: string;
  text: string;
  time: number;
}

const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const headlessNotificationListener = async ({ notification }: { notification: NotificationData }) => {
    if (notification) {
      setNotifications(prev => [notification, ...prev]);
    }
  }

  AppRegistry.registerHeadlessTask('NotificationListener', () => headlessNotificationListener);

  const renderNotification = ({ item }: { item: NotificationData }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.appName}>{item.app}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.time}>{new Date(item.time).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});

export default NotificationDisplay;
