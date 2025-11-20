import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'

export default function TextScreen() {
  const [message, setMessage] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)

  const conversations = [
    { id: 1, name: 'John Smith', lastMessage: 'Thanks for the info!', time: '2h ago', unread: 0 },
    { id: 2, name: 'Sarah Johnson', lastMessage: 'When can we schedule?', time: '5h ago', unread: 2 },
    { id: 3, name: 'Mike Davis', lastMessage: 'Sounds good', time: '1d ago', unread: 0 },
  ]

  const sendMessage = () => {
    if (message.trim()) {
      // Telnyx SMS integration would go here
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.composeButton}>
          <Text style={styles.composeButtonText}>✏️ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.conversationsList}>
        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversationItem}
            onPress={() => setSelectedContact(conv)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{conv.name[0]}</Text>
            </View>
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conv.name}</Text>
                <Text style={styles.conversationTime}>{conv.time}</Text>
              </View>
              <View style={styles.conversationFooter}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
                {conv.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{conv.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.composerContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          📱 Using personal iPhone number until Telnyx is configured
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#002d69',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  composeButton: {
    backgroundColor: '#f5d787',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  composeButtonText: {
    color: '#002d69',
    fontWeight: 'bold',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#002d69',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d69',
  },
  conversationTime: {
    fontSize: 12,
    color: '#64748b',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
  unreadBadge: {
    backgroundColor: '#f5d787',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#002d69',
    fontSize: 12,
    fontWeight: 'bold',
  },
  composerContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#002d69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
  },
  noteCard: {
    backgroundColor: '#fef7e7',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f5d787',
  },
  noteText: {
    fontSize: 12,
    color: '#64748b',
  },
})
