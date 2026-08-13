import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Keyboard,
  InputAccessoryView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AMOUNT_INPUT_ACCESSORY = 'liabilityAmountInput';

export default function LiabilitiesScreen() {
  const [liabilities, setLiabilities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadLiabilities();
  }, []);

  const loadLiabilities = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('netWorthData');
      if (jsonValue) {
        const data = JSON.parse(jsonValue);
        setLiabilities(data.liabilities);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load liabilities');
    }
  };

  const saveLiabilities = async (newLiabilities) => {
    try {
      const jsonValue = await AsyncStorage.getItem('netWorthData');
      const data = JSON.parse(jsonValue);
      data.liabilities = newLiabilities;
      data.lastUpdated = new Date().toISOString();
      await AsyncStorage.setItem('netWorthData', JSON.stringify(data));
    } catch (error) {
      Alert.alert('Error', 'Failed to save liabilities');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setName('');
    setAmount('');
  };

  const addLiability = () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Amount must be a valid number');
      return;
    }

    const newLiability = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      dateAdded: new Date().toISOString(),
    };

    const newLiabilities = [...liabilities, newLiability];
    setLiabilities(newLiabilities);
    saveLiabilities(newLiabilities);

    setName('');
    setAmount('');
    setModalVisible(false);
  };

  const deleteLiability = (id) => {
    Alert.alert('Delete Liability', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const newLiabilities = liabilities.filter((liability) => liability.id !== id);
          setLiabilities(newLiabilities);
          saveLiabilities(newLiabilities);
        },
        style: 'destructive',
      },
    ]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);

  const renderLiability = ({ item }) => (
    <TouchableOpacity
      style={styles.liabilityItem}
      onLongPress={() => deleteLiability(item.id)}
    >
      <View>
        <Text style={styles.liabilityName}>{item.name}</Text>
        <Text style={styles.liabilityDate}>
          {new Date(item.dateAdded).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.liabilityAmount}>{formatCurrency(item.amount)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Liabilities</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalLiabilities)}</Text>
        <Text style={styles.itemCount}>{liabilities.length} items</Text>
      </View>

      {/* Liabilities List */}
      <FlatList
        data={liabilities}
        renderItem={renderLiability}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No liabilities yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add a liability
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Liability Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Liability</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <TextInput
                style={styles.input}
                placeholder="Liability name (e.g., Mortgage)"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                inputAccessoryViewID={AMOUNT_INPUT_ACCESSORY}
              />
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addLiability}
              >
                <Text style={styles.confirmButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={AMOUNT_INPUT_ACCESSORY}>
          <View style={styles.keyboardToolbar}>
            <TouchableOpacity onPress={Keyboard.dismiss}>
              <Text style={styles.keyboardDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#999',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  liabilityItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  liabilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  liabilityDate: {
    fontSize: 12,
    color: '#999',
  },
  liabilityAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  keyboardToolbar: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  keyboardDoneText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
