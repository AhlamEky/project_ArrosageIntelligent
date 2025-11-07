// screens/ReclamationsScreen.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import CardRow from '../components/CardRow';

export default function ReclamationsScreen() {
  const { claims, addClaim, theme } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function submit() {
    if (!title) return alert('Ajoute un titre');
    addClaim({ title, body });
    setTitle(''); setBody('');
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme === 'dark' ? '#071033' : '#f7fbff' }]}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme === 'dark' ? '#e6eef8' : '#071033' }]}>Réclamations</Text>

        <CardRow title="Nouvelle réclamation">
          <Text style={styles.label}>Titre</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, { height: 80 }]} value={body} onChangeText={setBody} multiline />
          <View style={{ marginTop: 8 }}>
            <Button title="Envoyer" onPress={submit} color="#06b6d4" />
          </View>
        </CardRow>

        <CardRow title="Historique">
          <FlatList
            data={claims}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.claimCard}>
                <Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#071033' }}>{item.title}</Text>
                <Text style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>{item.body}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>{new Date(item.date).toLocaleString()}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>Aucune réclamation</Text>}
          />
        </CardRow>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  label: { marginTop: 8 },
  input: { padding: 10, borderRadius: 10, borderWidth: 1, marginTop: 6 },
  claimCard: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0b1726', marginBottom: 6 }
});
