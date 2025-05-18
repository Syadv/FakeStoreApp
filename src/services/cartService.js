export const saveCartToServer = async (token, items) => {
  try {
    await fetch('http://192.168.4.41:3000/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(items),
    });
  } catch (err) {
    console.log('Error saving cart:', err.message);
  }
};
