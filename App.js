// app entry file
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store.js';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
  
    <Provider store={store}>
      {/* navigation */}
      <NavigationContainer>
        {/* tabs and screens */}
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
