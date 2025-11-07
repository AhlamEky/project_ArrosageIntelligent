// components/CardRow.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function CardRow({ title, children, style }) {
  const { theme } = useApp();
  const bg = theme === 'dark' ? '#0b1220' : '#ffffff';
  const txt = theme === 'dark' ? '#e6eef8' : '#0f172a';

  return (
    <View style={[styles.card, { backgroundColor: bg }, style]}>
      {title ? <Text style={[styles.title, { color: txt }]}>{title}</Text> : null}
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8
  }
});
