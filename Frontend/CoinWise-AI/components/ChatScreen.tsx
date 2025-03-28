import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth, useClerk } from '@clerk/clerk-expo';

interface Message {
  text: string;
  isUser: boolean;
}

const presetPrompts = [
  {
    id: 'savings',
    text: "How can I save more from my monthly salary?",
    icon: "savings",
    category: "Savings"
  },
  {
    id: 'budgeting',
    text: "What's the 50-30-20 budgeting rule?",
    icon: "account-balance",
    category: "Budgeting"
  },
  {
    id: 'expenses',
    text: "Best ways to reduce food expenses",
    icon: "restaurant",
    category: "Expenses"
  },
  {
    id: 'emergency',
    text: "How to create an emergency fund?",
    icon: "emergency",
    category: "Planning"
  }
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const handlePresetPrompt = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.89:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { text: prompt, isUser: true },
        { text: data.answer, isUser: false }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: prompt, isUser: true },
        { text: "Sorry, I'm having trouble connecting to the server. Please try again later.", isUser: false }
      ]);
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { text: inputMessage, isUser: true },
        { text: data.answer, isUser: false }
      ]);
      setInputMessage('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { text: inputMessage, isUser: true },
        { text: "Sorry, I'm having trouble connecting to the server. Please try again later.", isUser: false }
      ]);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  const renderPrompt = ({ item }: { item: typeof presetPrompts[0] }) => (
    <TouchableOpacity 
      style={styles.promptButton}
      onPress={() => handlePresetPrompt(item.text)}
    >
      <View style={styles.promptIconContainer}>
        <MaterialIcons name={item.icon as any} size={20} color="#ffffff" />
      </View>
      <View style={styles.promptContent}>
        <Text style={styles.promptCategory}>{item.category}</Text>
        <Text style={styles.promptText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="savings" size={28} color="#2c3e50" />
          <Text style={styles.headerText}>Savings Advisor</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/(app)/investments')}
          >
            <MaterialIcons name="trending-up" size={24} color="#1a237e" />
          </TouchableOpacity>
          {isSignedIn ? (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSignOut}
            >
              <MaterialIcons name="logout" size={24} color="#1a237e" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/sign-in')}
            >
              <MaterialIcons name="login" size={24} color="#1a237e" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {!isSignedIn ? (
        <View style={styles.authPrompt}>
          <MaterialIcons name="lock" size={48} color="#1a237e" />
          <Text style={styles.authTitle}>Welcome to CoinWise AI</Text>
          <Text style={styles.authSubtitle}>Sign in to get personalized financial advice</Text>
          <TouchableOpacity 
            style={styles.authButton}
            onPress={() => router.push('/sign-in')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.promptSection}>
            <Text style={styles.promptSectionTitle}>Quick Tips</Text>
            <FlatList
              data={presetPrompts}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderPrompt}
              keyExtractor={(item) => item.id}
              style={styles.promptList}
            />
          </View>

          <FlatList
            data={messages}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[
                styles.messageBubble, 
                item.isUser ? styles.userBubble : styles.botBubble
              ]}>
                {!item.isUser && (
                  <MaterialIcons name="smart-toy" size={20} color="#2c3e50" style={styles.botIcon} />
                )}
                <Text style={[
                  styles.messageText,
                  item.isUser ? styles.userMessageText : styles.botMessageText
                ]}>{item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.chatHistory}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3498db" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Ask about savings..."
              placeholderTextColor="#95a5a6"
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
            >
              <MaterialIcons 
                name="send" 
                size={24} 
                color={inputMessage.trim() ? '#3498db' : '#95a5a6'} 
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 10,
    borderWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1a237e',
  },
  promptSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  promptSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginLeft: 20,
    marginBottom: 12,
  },
  promptList: {
    paddingHorizontal: 16,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: 280,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  promptIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promptContent: {
    flex: 1,
  },
  promptCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  promptText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  chatHistory: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: '85%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userBubble: {
    backgroundColor: '#1a237e',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  botIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: '#1a237e',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loadingText: {
    marginLeft: 8,
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    color: '#1a237e',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sendButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#1a237e',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a237e',
    marginTop: 16,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatScreen;