// screens/DashboardScreen.js

// screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardRow from '../components/CardRow';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { database } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';
import { update } from 'firebase/database'; 
export default function DashboardScreen() {
  const { user, thresholds, theme } = useApp();

  const [sensor, setSensor] = useState({
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    pumpStatus: 'OFF',
  });

  // Charger les vraies données depuis Firebase 🔥
  useEffect(() => {
    if (!user) return;

    const sensorRef = ref(database, `users/${user.uid}/sensor`);
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensor(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Simuler des données capteurs aléatoires
  async function simulateData() {
    if (!user) return;
    const newData = {
      soilMoisture: Math.floor(Math.random() * 100),
      temperature: Math.floor(20 + Math.random() * 10),
      humidity: Math.floor(40 + Math.random() * 30),
    };
    // ✅ on met à jour seulement les valeurs capteurs sans effacer pumpStatus
    await update(ref(database, `users/${user.uid}/sensor`), newData);
    setSensor({ ...sensor, ...newData });
  }

  const colors = theme === 'dark'
    ? { bg: '#071033', head: '#e6eef8', text: '#cbd5e1' }
    : { bg: '#f7fbff', head: '#071033', text: '#475569' };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: colors.head }]}>Tableau de bord</Text>
          <Ionicons name="analytics" size={26} color="#7dd3fc" />
        </View>

        <View style={{ marginBottom: 12 }}>
          <Button title="Simuler lectures" onPress={simulateData} color="#06b6d4" />
        </View>

        {/* Carte principale : Humidité du sol */}
        <CardRow title="Humidité du sol">
          <View style={styles.row}>
            <Text style={styles.big}>{sensor.soilMoisture}%</Text>
            <ProgressBar value={sensor.soilMoisture} />
          </View>
          {sensor.soilMoisture < thresholds.moistureMin && (
            <Text style={styles.warn}>⚠️ Sous le seuil min ({thresholds.moistureMin}%)</Text>
          )}
          {sensor.soilMoisture > thresholds.moistureMax && (
            <Text style={styles.warn}>⚠️ Au-dessus du seuil max ({thresholds.moistureMax}%)</Text>
          )}
        </CardRow>

        {/* Autres valeurs capteurs */}
        <CardRow title="Données environnementales">
          <Text style={{ color: colors.text }}>🌡 Température : {sensor.temperature}°C</Text>
          <Text style={{ color: colors.text }}>💧 Humidité de l’air : {sensor.humidity}%</Text>
          <Text style={{ color: colors.text }}>🚰 Pompe : {sensor.pumpStatus}</Text>
        </CardRow>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 22, fontWeight: '800' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  big: { fontSize: 26, fontWeight: '900', marginRight: 12 },
  warn: { color: '#fb7185', marginTop: 4 },
});

/*
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database } from "../config/firebase";
import { ref, onValue } from "firebase/database";

export default function DashboardScreen() {
  const [sensor, setSensor] = useState(null);


  useEffect(() => {
    const sensorRef = ref(database, "sensor");
    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setSensor(data);
    });
  }, []);

  if (!sensor) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text>Chargement des données du capteur...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Tableau de bord</Text>
          <Ionicons name="analytics" size={26} color="#06b6d4" />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>💧 Humidité de l'air</Text>
          <Text style={styles.value}>{sensor.humidity} %</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>🌱 Humidité du sol</Text>
          <Text style={styles.value}>{sensor.soilMoisture}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>🌡️ Température</Text>
          <Text style={styles.value}>{sensor.temperature} °C</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  label: { fontSize: 18, color: "#334155" },
  value: { fontSize: 22, fontWeight: "bold", color: "#0284c7", marginTop: 4 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
*/
