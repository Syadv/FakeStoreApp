import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // categories once when screen loads
  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  // go to product list when category is clicked
  const handleCategoryPress = (category) => {
    navigation.navigate('Products', { category });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        // loading spinner
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        // list of categories
        <FlatList
          data={categories}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item)}
            >
              <Text style={styles.categoryText}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f6f6',
  },
  categoryItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
