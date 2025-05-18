import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const PRIMARY = '#FF7043';
const BACKGROUND = '#FFF3E0';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCategoryPress = (category) => {
    navigation.navigate('Products', { category });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item}
          contentContainerStyle={styles.list}
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
    backgroundColor: BACKGROUND,
    padding: 16,
  },
  list: {
    paddingTop: 8,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY,
  },
});
