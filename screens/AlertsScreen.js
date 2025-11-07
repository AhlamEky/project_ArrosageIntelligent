// screens/AlertsScreen.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import CardRow from '../components/CardRow';

export default function AlertsScreen() {
  const { thresholds, updateThresholds, theme } = useApp();
  const [min, setMin] = useState(String(thresholds.moistureMin));
  const [max, setMax] = useState(String(thresholds.moistureMax));

  function save() {
    const m = Number(min);
    const M = Number(max);
    if (isNaN(m) || isNaN(M)) return Alert.alert('Valeurs invalides');
    if (m >= M) return Alert.alert('Le seuil min doit être inférieur au seuil max');
    updateThresholds({ moistureMin: m, moistureMax: M });
    Alert.alert('Seuils mis à jour');
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme === 'dark' ? '#071033' : '#f7fbff' }]}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme === 'dark' ? '#e6eef8' : '#071033' }]}>Seuils d'alerte</Text>

        <CardRow title="Humidité (%)">
          <View style={styles.field}>
            <Text style={styles.label}>Seuil min</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={min} onChangeText={setMin} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Seuil max</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={max} onChangeText={setMax} />
          </View>

          <View style={{ marginTop: 8 }}>
            <Button title="Enregistrer" onPress={save} color="#06b6d4" />
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>Actuels : min {thresholds.moistureMin}% — max {thresholds.moistureMax}%</Text>
          </View>
        </CardRow>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  field: { marginBottom: 8 },
  label: { marginBottom: 6 },
  input: { padding: 10, borderRadius: 10, borderWidth: 1, marginTop: 6 }
});
