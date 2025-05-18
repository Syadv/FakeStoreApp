import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsNavigator from './ProductsNavigator';
import CartScreen from '../screens/CartScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  // total items in cart badge
  const totalQuantity   = useSelector(state => state.cart.totalQuantity);
  // count of unpaid orders for orders-badge
  const newOrdersCount  = useSelector(state =>
    state.orders.orders.filter(order => !order.isPaid).length
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Store') {
            iconName = 'grid';
          } else if (route.name === 'Cart') {
            iconName = 'cart';
          } else if (route.name === 'Orders') {
            iconName = 'receipt';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarBadge:
          route.name === 'Cart'
            ? totalQuantity > 0
              ? totalQuantity
              : null
            : route.name === 'Orders'
            ? newOrdersCount > 0
              ? newOrdersCount
              : null
            : null,
      })}
    >
      <Tab.Screen name="Store"   component={ProductsNavigator} />
      <Tab.Screen name="Cart"    component={CartScreen} />
      <Tab.Screen name="Orders"  component={OrderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}