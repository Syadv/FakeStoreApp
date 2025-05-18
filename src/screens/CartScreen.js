import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../features/cart/cartSlice';
import { placeOrder, fetchOrders } from '../features/orders/ordersSlice';

export default function CartScreen({ navigation }) {
  const dispatch    = useDispatch();
  const items       = useSelector(s => s.cart.items);
  const totalAmount = useSelector(s => s.cart.totalAmount);

  const confirmCheckout = () => {
    if (!items.length) {
      return Alert.alert('Cart is empty', 'Add items to cart before checking out.');
    }

    Alert.alert(
      'Proceed to Checkout',
      `You have ${items.reduce((sum, i) => sum + i.quantity, 0)} item(s) totaling $${totalAmount.toFixed(2)}.\n\nContinue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await dispatch(placeOrder(items)).unwrap();
              dispatch(fetchOrders());
              Alert.alert('Success', 'Your order has been placed.');
              navigation.navigate('Orders');
            } catch (err) {
              Alert.alert('Error', err.message || err.toString());
            }
          }
        }
      ]
    );
  };

  if (!items.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.total}>Total: ${item.totalPrice.toFixed(2)}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => dispatch(decreaseQuantity(item.id))}
          >
            <Text style={styles.qtySign}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyCount}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => dispatch(increaseQuantity(item.id))}
          >
            <Text style={styles.qtySign}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => dispatch(removeFromCart(item.id))}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          Items: {items.reduce((sum, i) => sum + i.quantity, 0)}
        </Text>
        <Text style={styles.summaryText}>
          Total: ${totalAmount.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.checkoutBtn} onPress={confirmCheckout}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY    = '#FF7043';
const ACCENT     = '#BF360C';
const BACKGROUND = '#FFF3E0';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    padding: 16,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: PRIMARY,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: PRIMARY,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: ACCENT,
    marginBottom: 4,
  },
  total: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qtyBtn: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtySign: {
    fontSize: 18,
  },
  qtyCount: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  removeBtn: {
    marginTop: 4,
  },
  removeText: {
    color: ACCENT,
  },
  checkoutBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND,
  },
  emptyText: {
    fontSize: 18,
    color: ACCENT,
  },
});
