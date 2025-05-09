import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function ProductsScreen({ route, navigation }) {
  const { category } = route.params; // get category from previous screen
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // products for this category
  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [category]);

  // go to product detail screen
  const handleProductPress = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1976d2" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productContainer} onPress={() => handleProductPress(item)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    resizeMode: 'contain',
  },
  productInfo: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  price: {
    color: '#1976d2',
    marginTop: 6,
    fontWeight: 'bold',
  },
});
