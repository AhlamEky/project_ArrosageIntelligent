// screens/SettingsScreen.js
import React from 'react';
import { SafeAreaView, View, Text, Switch, StyleSheet, Button } from 'react-native';
import { useApp } from '../context/AppContext';
import CardRow from '../components/CardRow';

export default function SettingsScreen() {
  const { prefs, setPrefs, theme, setTheme, signout } = useApp();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme === 'dark' ? '#071033' : '#f7fbff' }]}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme === 'dark' ? '#e6eef8' : '#071033' }]}>Paramètres</Text>

        <CardRow title="Apparence">
          <View style={styles.row}>
            <Text style={{ color: theme === 'dark' ? '#fff' : '#071033' }}>Mode</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="Light" onPress={() => setTheme('light')} />
              <Button title="Dark" onPress={() => setTheme('dark')} />
            </View>
          </View>
        </CardRow>

        <CardRow title="Compte">
          <View style={styles.row}>
            <Text style={{ color: theme === 'dark' ? '#fff' : '#071033' }}>Se déconnecter</Text>
            <Button title="Logout" onPress={() => signout()} />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }
});
