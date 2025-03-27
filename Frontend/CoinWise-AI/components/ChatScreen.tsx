import  { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  text: string;
  isUser: boolean;
}

const presetPrompts = [
  "How can I save more from my monthly salary?",
  "What's the 50-30-20 budgeting rule?",
  "Best ways to reduce food expenses",
  "How to create an emergency fund?",
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePresetPrompt = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.100:3000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: prompt }),
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
      const response = await fetch('http://192.168.1.100:3000/askSuggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputMessage }),
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialIcons name="savings" size={28} color="#2c3e50" />
        <Text style={styles.headerText}>Savings Advisor</Text>
      </View>
      
      <FlatList
        data={presetPrompts}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.promptButton}
            onPress={() => handlePresetPrompt(item)}
          >
            <MaterialIcons name="lightbulb" size={16} color="white" style={styles.promptIcon} />
            <Text style={styles.promptText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.promptList}
      />

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
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1a237e',
  },
  promptList: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    padding: 12,
    borderRadius: 25,
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promptIcon: {
    marginRight: 8,
  },
  promptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
});

export default ChatScreen;