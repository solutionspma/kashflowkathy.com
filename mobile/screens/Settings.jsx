import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

export default function SettingsScreen({ navigation }) {
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Profile', screen: 'Profile' },
        { icon: '🔔', label: 'Notifications', screen: 'Notifications' },
        { icon: '🔐', label: 'Privacy & Security', screen: 'Privacy' },
      ],
    },
    {
      title: 'CRM',
      items: [
        { icon: '📊', label: 'Pipeline Settings', screen: 'PipelineSettings' },
        { icon: '✉️', label: 'Email Templates', screen: 'Templates' },
        { icon: '🤖', label: 'Automations', screen: 'Automations' },
      ],
    },
    {
      title: 'Integrations',
      items: [
        { icon: '📞', label: 'Telnyx Setup', screen: 'Telnyx' },
        { icon: '🎥', label: 'Zoom Integration', screen: 'Zoom' },
        { icon: '📱', label: 'Social Media', screen: 'SocialMedia' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: '❓', label: 'Help & FAQ', screen: 'Help' },
        { icon: '📧', label: 'Contact Support', screen: 'Support' },
        { icon: 'ℹ️', label: 'About', screen: 'About' },
      ],
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>K</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Kathy Ferguson</Text>
          <Text style={styles.profileEmail}>kathy@costseg.tax</Text>
          <Text style={styles.profileRole}>Administrator</Text>
        </View>
      </View>

      <ScrollView style={styles.settingsList}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionText}>© 2025 Kashflow Kathy</Text>
        </View>
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
  profileCard: {
    flexDirection: 'row',
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
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#002d69',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002d69',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    color: '#f5d787',
    backgroundColor: '#002d69',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
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
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#002d69',
  },
  settingArrow: {
    fontSize: 24,
    color: '#cbd5e1',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  versionInfo: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
})
