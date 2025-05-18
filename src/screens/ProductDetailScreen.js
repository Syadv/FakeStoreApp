import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../features/cart/cartSlice';

const PRIMARY    = '#FF7043';
const ACCENT     = '#BF360C';
const BACKGROUND = '#FFF3E0';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const dispatch    = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart(product));
    Alert.alert(
      'Added to cart',
      `"${product.title}" has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerText}>Product Details</Text>
      </View>

      {/* Image */}
      <View style={s.imageCard}>
        <Image source={{ uri: product.image }} style={s.image} />
      </View>

      {/* Title */}
      <Text style={s.title}>{product.title}</Text>

      {/* Stats Bar */}
      <View style={s.stats}>
        <View style={s.chip}>
          <Text style={s.chipLabel}>Rate:</Text>
          <Text style={s.chipValue}>
            {product.rating?.rate.toFixed(1)}
          </Text>
        </View>
        <View style={s.chip}>
          <Text style={s.chipLabel}>Count:</Text>
          <Text style={s.chipValue}>
            {product.rating?.count}
          </Text>
        </View>
        <View style={s.chip}>
          <Text style={s.chipLabel}>Price:</Text>
          <Text style={s.chipValue}>
            ${product.price.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity
          style={[s.btn, s.backBtn]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={s.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btn, s.cartBtn]}
          onPress={handleAdd}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={s.btnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={s.descCard}>
        <Text style={s.descHeader}>Description:</Text>
        <Text style={s.descText}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  imageCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    padding: 8,
    alignItems: 'center',
  },
  image: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  title: {
    marginHorizontal: 16,
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 1,
    alignItems: 'center',
  },
  chipLabel: {
    fontSize: 14,
    color: PRIMARY,
    marginRight: 4,
    fontWeight: '500',
  },
  chipValue: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  backBtn: {
    backgroundColor: ACCENT,
  },
  cartBtn: {
    backgroundColor: PRIMARY,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
  },
  descCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderLeftWidth: 6,
    borderLeftColor: PRIMARY,
    borderRadius: 6,
    elevation: 1,
  },
  descHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT,
    marginBottom: 6,
  },
  descText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
