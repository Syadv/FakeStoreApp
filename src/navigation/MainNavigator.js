import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsNavigator from './ProductsNavigator';
import CartScreen from '../screens/CartScreen';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const totalQuantity = useSelector(state => state.cart.totalQuantity); // get cart count

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // set tab icon
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') {
            iconName = 'list';
          } else if (route.name === 'Cart') {
            iconName = 'cart';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // show badge on cart tab
        tabBarBadge: route.name === 'Cart' && totalQuantity > 0 ? totalQuantity : null,
      })}
    >
      <Tab.Screen name="Products" component={ProductsNavigator} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}
