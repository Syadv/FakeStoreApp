import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params; // get product from route
  const dispatch = useDispatch();

  // add product to cart
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'justify',
  },
  buttonContainer: {
    marginTop: 10,
    width: '80%',
  },
});
