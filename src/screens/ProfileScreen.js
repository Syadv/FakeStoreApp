import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateProfile } from '../features/auth/authSlice';

const PRIMARY    = '#FF7043';
const ACCENT     = '#BF360C';
const BACKGROUND = '#FFF3E0';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const token    = useSelector(s => s.auth.token);
  const user     = useSelector(s => s.auth.user) || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName]           = useState(user.name);
  const [newPassword, setNewPassword]   = useState('');

  const openModal = () => {
    setNewName(user.name);
    setNewPassword('');
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!newName.trim() || !newPassword.trim()) {
      return alert('Name and password are required.');
    }
    try {
      const res = await fetch(`http://192.168.4.41:3000/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, password: newPassword }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();
      dispatch(updateProfile({ name: data.name }));
      setModalVisible(false);
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          editable={false}
        />

        <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          editable={false}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.btn, styles.updateBtn]} onPress={openModal}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.signOutBtn]} onPress={handleSignOut}>
          <Text style={styles.btnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Update Profile</Text>

            <Text style={styles.label}>New Name</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    padding: 16,
  },
  header: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: ACCENT,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: ACCENT,
  },
  input: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  updateBtn: {
    backgroundColor: PRIMARY,
  },
  signOutBtn: {
    backgroundColor: ACCENT,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
  },
  confirmBtn: {
    backgroundColor: PRIMARY,
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
