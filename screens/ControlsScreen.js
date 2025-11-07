// screens/ControlsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function ControlScreen() {
  const [pumpStatus, setPumpStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧭 Ton UID utilisateur (à adapter si tu gères plusieurs users)
  const userId = "P2sE2DrrMdcKMRFWqx1etlnxRiF3";
  const db = getDatabase();
  const pumpRef = ref(db, `users/${userId}/sensor/pumpStatus`);

  // 🔁 Lire l’état actuel de la pompe depuis Firebase
  useEffect(() => {
    const unsubscribe = onValue(pumpRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        setPumpStatus(value === "ON"); // car c’est une chaîne "ON"/"OFF"
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🕹️ Fonction pour changer l’état de la pompe
  const togglePump = async () => {
    const newStatus = pumpStatus ? "OFF" : "ON";
    await set(pumpRef, newStatus);
    setPumpStatus(newStatus);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text>Chargement de l’état de la pompe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contrôle de la Pompe 💧</Text>

      <View style={styles.statusContainer}>
        <Ionicons
          name={pumpStatus ? "water" : "water-outline"}
          size={60}
          color={pumpStatus ? "#06b6d4" : "#94a3b8"}
        />
        <Text style={styles.statusText}>
          Pompe : {pumpStatus ? "ON" : "OFF"}
        </Text>
      </View>

      <Switch
        value={pumpStatus}
        onValueChange={togglePump}
        thumbColor={pumpStatus ? "#06b6d4" : "#f4f4f5"}
        trackColor={{ true: "#bae6fd", false: "#e2e8f0" }}
        style={{ transform: [{ scale: 1.4 }] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fbff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#071033',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
import React from 'react';
import { SafeAreaView, View, Text, Switch, Button, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import CardRow from '../components/CardRow';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ControlsScreen() {
  const { pumps, togglePump, zones, randomizeSensors, theme } = useApp();

  function onToggle(id) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    togglePump(id);
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme === 'dark' ? '#071033' : '#f7fbff' }]}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme === 'dark' ? '#e6eef8' : '#071033' }]}>Contrôle manuel</Text>

        <CardRow title="Pompes">
          {pumps.map(p => (
            <View key={p.id} style={styles.row}>
              <Text style={{ color: theme === 'dark' ? '#fff' : '#071033' }}>{p.name} — {p.zoneId}</Text>
              <Switch value={p.on} onValueChange={() => onToggle(p.id)} />
            </View>
          ))}
        </CardRow>

        <CardRow title="Capteurs (lecture)">
          {zones.map(z => (
            <View key={z.id} style={styles.row}>
              <Text style={{ color: theme === 'dark' ? '#e6eef8' : '#071033' }}>{z.name}</Text>
              <Text style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>{z.moisture}%</Text>
            </View>
          ))}
        </CardRow>

        <View style={{ marginTop: 8 }}>
          <Button title="Simuler update capteurs" onPress={randomizeSensors} color="#06b6d4" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }
});*/
