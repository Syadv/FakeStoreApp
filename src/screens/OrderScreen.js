// File: src/screens/OrderScreen.js

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  payOrder,
  deliverOrder
} from '../features/orders/ordersSlice';
import { useFocusEffect } from '@react-navigation/native';

const PRIMARY    = '#FF7043';
const ACCENT     = '#BF360C';
const BACKGROUND = '#FFF3E0';

export default function OrderScreen() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(s => s.orders);

  const [showNew, setShowNew]             = useState(true);
  const [showPaid, setShowPaid]           = useState(false);
  const [showDelivered, setShowDelivered] = useState(false);

  useFocusEffect(useCallback(() => {
    dispatch(fetchOrders());
  }, [dispatch]));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const newOrders       = orders.filter(o => !o.isPaid);
  const paidOrders      = orders.filter(o => o.isPaid && !o.isDelivered);
  const deliveredOrders = orders.filter(o => o.isPaid && o.isDelivered);

  return (
    <View style={styles.screen}>
      <FlatList
        data={[]}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.title}>My Orders</Text>

            {/* New Orders */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowNew(v => !v)}
              >
                <Text style={styles.sectionHeaderText}>
                  New Orders: {newOrders.length}
                </Text>
                <Text style={styles.sectionHeaderText}>
                  {showNew ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {showNew && newOrders.map(o => (
                <View key={o.id} style={styles.card}>
                  <Text style={styles.orderId}>Order #{o.id}</Text>
                  <Text style={styles.summary}>
                    Items: {o.items.reduce((s, i) => s + i.quantity, 0)} &bull;  
                    Total: ${o.total.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => dispatch(payOrder(o.id))}
                  >
                    <Text style={styles.actionText}>Pay</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Paid Orders */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowPaid(v => !v)}
              >
                <Text style={styles.sectionHeaderText}>
                  Paid Orders: {paidOrders.length}
                </Text>
                <Text style={styles.sectionHeaderText}>
                  {showPaid ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {showPaid && paidOrders.map(o => (
                <View key={o.id} style={styles.card}>
                  <Text style={styles.orderId}>Order #{o.id}</Text>
                  <Text style={styles.summary}>
                    Items: {o.items.reduce((s, i) => s + i.quantity, 0)} &bull;  
                    Total: ${o.total.toFixed(2)}
                  </Text>
                  {o.items.map((i, idx) => (
                    <Text key={idx} style={styles.itemLine}>
                      • Price: ${i.price.toFixed(2)} ×{i.quantity}
                    </Text>
                  ))}
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => dispatch(deliverOrder(o.id))}
                  >
                    <Text style={styles.actionText}>Receive</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Delivered Orders */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowDelivered(v => !v)}
              >
                <Text style={styles.sectionHeaderText}>
                  Delivered Orders: {deliveredOrders.length}
                </Text>
                <Text style={styles.sectionHeaderText}>
                  {showDelivered ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {showDelivered && deliveredOrders.map(o => (
                <View key={o.id} style={styles.card}>
                  <Text style={styles.orderId}>Order #{o.id}</Text>
                  <Text style={styles.summary}>
                    Items: {o.items.reduce((s, i) => s + i.quantity, 0)} &bull;  
                    Total: ${o.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        renderItem={null}
        keyExtractor={() => 'dummy'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    elevation: 1,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: ACCENT,
  },
  card: {
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: PRIMARY,
    marginTop: 8,
    padding: 12,
    borderRadius: 6,
    elevation: 2,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  summary: {
    fontSize: 14,
    color: '#333',
    marginVertical: 6,
  },
  itemLine: {
    fontSize: 14,
    marginLeft: 8,
    marginVertical: 2,
    color: '#555',
  },
  actionBtn: {
    marginTop: 10,
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: ACCENT,
    fontSize: 16,
  },
});
