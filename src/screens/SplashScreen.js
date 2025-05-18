import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/fakestore.png')}
        style={styles.image}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',  // fallback while loading
  },
  image: {
    width,
    height,
    resizeMode: 'cover',      // cover entire screen
  },
});
