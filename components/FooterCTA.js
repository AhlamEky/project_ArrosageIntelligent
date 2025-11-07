// components/FooterCTA.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function FooterCTA({ onPress }) {
  const { theme } = useApp();
  return (
    <View style={[styles.wrap, { backgroundColor: theme === 'dark' ? '#021419' : '#f1fbf6' }]}>
      <Text style={{ color: theme === 'dark' ? '#9ae6b4' : '#065f46', fontWeight: '700' }}>Besoin d’aide ?</Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: theme === 'dark' ? '#06b6d4' : '#0ea5a3' }]} onPress={onPress}>
        <Text style={{ color: '#041426', fontWeight: '800' }}>Contacter le support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, borderRadius: 10, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 }
});
