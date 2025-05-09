import React from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../features/cart/cartSlice';

export default function CartScreen() {
  // get items and total from redux
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const dispatch = useDispatch();

  // show each cart item
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>Price: ${item.price.toFixed(2)}</Text>
        <Text>Total: ${item.totalPrice.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(decreaseQuantity(item.id))}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(increaseQuantity(item.id))}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => dispatch(removeFromCart(item.id))}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // if nothing in cart
  if (cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Your shopping cart is empty.</Text>
      </View>
    );
  }

  // show cart summary and list
  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>
        Total Items: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      </Text>
      <Text style={styles.summaryText}>
        Total Amount: ${totalAmount.toFixed(2)}
      </Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: 18,
  },
  removeButton: {
    marginTop: 4,
  },
  removeText: {
    color: 'red',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
