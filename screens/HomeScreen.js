import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState({ assets: [], liabilities: [] });
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('netWorthData');
      if (jsonValue) {
        setData(JSON.parse(jsonValue));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const totalAssets = calculateTotal(data.assets);
  const totalLiabilities = calculateTotal(data.liabilities);
  const netWorth = totalAssets - totalLiabilities;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Net Worth Card */}
      <View style={styles.netWorthCard}>
        <Text style={styles.label}>Total Net Worth</Text>
        <Text
          style={[
            styles.netWorthAmount,
            { color: netWorth >= 0 ? '#34C759' : '#FF3B30' },
          ]}
        >
          {formatCurrency(netWorth)}
        </Text>
      </View>

      {/* Assets Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>💰 Assets</Text>
          <Text style={styles.cardAmount}>{formatCurrency(totalAssets)}</Text>
        </View>
        <Text style={styles.itemCount}>
          {data.assets.length} item{data.assets.length !== 1 ? 's' : ''}
        </Text>
        {data.assets.length > 0 && (
          <View style={styles.previewList}>
            {data.assets.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.previewItem}>
                <Text style={styles.previewLabel}>{item.name}</Text>
                <Text style={styles.previewAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
            {data.assets.length > 3 && (
              <Text style={styles.moreText}>
                +{data.assets.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Liabilities Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>💳 Liabilities</Text>
          <Text style={styles.cardAmount}>{formatCurrency(totalLiabilities)}</Text>
        </View>
        <Text style={styles.itemCount}>
          {data.liabilities.length} item{data.liabilities.length !== 1 ? 's' : ''}
        </Text>
        {data.liabilities.length > 0 && (
          <View style={styles.previewList}>
            {data.liabilities.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.previewItem}>
                <Text style={styles.previewLabel}>{item.name}</Text>
                <Text style={styles.previewAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
            {data.liabilities.length > 3 && (
              <Text style={styles.moreText}>
                +{data.liabilities.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Info Text */}
      {data.assets.length === 0 && data.liabilities.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Get started by adding your first asset or liability!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  netWorthCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  netWorthAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  itemCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  previewList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  previewLabel: {
    fontSize: 14,
    color: '#333',
  },
  previewAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  moreText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 6,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
