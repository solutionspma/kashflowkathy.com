import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native'

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)

  const notifications = [
    { id: 1, type: 'lead', title: 'New Lead Added', message: 'John Smith filled out calculator', time: '10m ago', read: false },
    { id: 2, type: 'followup', title: 'Follow-up Reminder', message: 'Sarah Johnson - 3 day follow-up', time: '1h ago', read: false },
    { id: 3, type: 'deal', title: 'Deal Updated', message: 'Mike Davis moved to Proposal Sent', time: '2h ago', read: true },
    { id: 4, type: 'ai', title: 'AI Recommendation', message: 'Send follow-up to 3 warm leads', time: '5h ago', read: true },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Notification Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#cbd5e1', true: '#f5d787' }}
            thumbColor={pushEnabled ? '#002d69' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>SMS Alerts</Text>
          <Switch
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            trackColor={{ false: '#cbd5e1', true: '#f5d787' }}
            thumbColor={smsEnabled ? '#002d69' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Email Notifications</Text>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: '#cbd5e1', true: '#f5d787' }}
            thumbColor={emailEnabled ? '#002d69' : '#f4f3f4'}
          />
        </View>
      </View>

      <ScrollView style={styles.notificationsList}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notificationItem, !notif.read && styles.unreadNotification]}
          >
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationIconText}>
                {notif.type === 'lead' ? '👤' :
                 notif.type === 'followup' ? '⏰' :
                 notif.type === 'deal' ? '💼' :
                 '🤖'}
              </Text>
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notif.title}</Text>
              <Text style={styles.notificationMessage}>{notif.message}</Text>
              <Text style={styles.notificationTime}>{notif.time}</Text>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  settingsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d69',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d69',
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
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
  unreadNotification: {
    backgroundColor: '#fef7e7',
    borderLeftWidth: 4,
    borderLeftColor: '#f5d787',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d69',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f5d787',
  },
})
