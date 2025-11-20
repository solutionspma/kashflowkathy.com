import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

export default function CallScreen({ navigation }) {
  const recentCalls = [
    { id: 1, name: 'John Smith', number: '(225) 555-0123', type: 'outbound', duration: '5:23' },
    { id: 2, name: 'Sarah Johnson', number: '(225) 555-0456', type: 'inbound', duration: '12:45' },
    { id: 3, name: 'Mike Davis', number: '(225) 555-0789', type: 'missed', duration: null },
  ]

  const makeCall = (number) => {
    // Telnyx calling integration would go here
    console.log('Calling:', number)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calls</Text>
      </View>

      <View style={styles.dialPad}>
        <Text style={styles.dialPadTitle}>Quick Dial</Text>
        <TouchableOpacity
          style={styles.dialButton}
          onPress={() => makeCall('Kathy iPhone')}
        >
          <Text style={styles.dialButtonText}>📱 Use Personal iPhone</Text>
          <Text style={styles.dialButtonSub}>Until Telnyx configured</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Calls</Text>
        {recentCalls.map((call) => (
          <View key={call.id} style={styles.callItem}>
            <View style={styles.callIcon}>
              <Text style={styles.callIconText}>
                {call.type === 'outbound' ? '📞' : call.type === 'inbound' ? '📲' : '❌'}
              </Text>
            </View>
            <View style={styles.callInfo}>
              <Text style={styles.callName}>{call.name}</Text>
              <Text style={styles.callNumber}>{call.number}</Text>
            </View>
            <View style={styles.callDuration}>
              <Text style={styles.callDurationText}>{call.duration || 'Missed'}</Text>
            </View>
            <TouchableOpacity
              style={styles.callBackButton}
              onPress={() => makeCall(call.number)}
            >
              <Text style={styles.callBackIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#002d69',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dialPad: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
  },
  dialPadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002d69',
    marginBottom: 12,
  },
  dialButton: {
    backgroundColor: '#f5d787',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d69',
  },
  dialButtonSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002d69',
    marginBottom: 12,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  callIcon: {
    marginRight: 12,
  },
  callIconText: {
    fontSize: 24,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d69',
    marginBottom: 2,
  },
  callNumber: {
    fontSize: 14,
    color: '#64748b',
  },
  callDuration: {
    marginRight: 12,
  },
  callDurationText: {
    fontSize: 14,
    color: '#64748b',
  },
  callBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#002d69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callBackIcon: {
    fontSize: 20,
  },
})
