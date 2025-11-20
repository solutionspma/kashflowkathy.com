import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

export default function PipelineScreen() {
  const stages = [
    { name: 'Inquiry', deals: 12, value: 125000 },
    { name: 'Qualified', deals: 8, value: 240000 },
    { name: 'Proposal Sent', deals: 5, value: 180000 },
    { name: 'Negotiation', deals: 3, value: 95000 },
    { name: 'Contract Signed', deals: 2, value: 65000 },
  ]

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0)
  const totalDeals = stages.reduce((sum, stage) => sum + stage.deals, 0)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pipeline</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Deals</Text>
          <Text style={styles.summaryValue}>{totalDeals}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Value</Text>
          <Text style={styles.summaryValue}>${(totalValue / 1000).toFixed(0)}K</Text>
        </View>
      </View>

      <ScrollView style={styles.stagesList}>
        <Text style={styles.sectionTitle}>Pipeline Stages</Text>
        {stages.map((stage, index) => (
          <TouchableOpacity key={index} style={styles.stageItem}>
            <View style={styles.stageHeader}>
              <Text style={styles.stageName}>{stage.name}</Text>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>{stage.deals}</Text>
              </View>
            </View>
            <View style={styles.stageFooter}>
              <Text style={styles.stageValue}>
                ${stage.value.toLocaleString()}
              </Text>
              <Text style={styles.stagePercentage}>
                {((stage.value / totalValue) * 100).toFixed(0)}% of total
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(stage.value / totalValue) * 100}%` },
                ]}
              />
            </View>
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
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002d69',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
  },
  stagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d69',
    marginBottom: 12,
  },
  stageItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d69',
  },
  stageBadge: {
    backgroundColor: '#002d69',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  stagePercentage: {
    fontSize: 12,
    color: '#64748b',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f5d787',
  },
})
