// components/ProgressBar.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useApp } from '../context/AppContext';

export default function ProgressBar({ value = 0 }) {
  const { theme } = useApp();
  const dark = theme === 'dark';
  const bg = dark ? '#072226' : '#e6f4ef';
  const fill = value < 30 ? '#f97316' : value > 80 ? '#ef4444' : '#10b981';
  const labelColor = dark ? '#cbd5e1' : '#065f46';
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <View style={styles.container}>
      <View style={[styles.bg, { backgroundColor: bg }]}>
        <View style={[styles.fill, { width: `${width}%`, backgroundColor: fill }]} />
      </View>
      <Text style={[styles.label, { color: labelColor }]}>{Math.round(width)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  bg: {
    flex: 1,
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10
  },
  fill: { height: '100%' },
  label: { width: 48, textAlign: 'right', fontWeight: '700' }
});
