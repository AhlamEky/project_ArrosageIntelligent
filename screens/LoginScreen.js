// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { useApp } from '../context/AppContext';

// Simple email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const {
    signin,
    signup,
    resetPassword,
    theme,
    // debug values from context if needed
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Improved error parser for Firebase errors
  function parseFirebaseError(err) {
    if (!err) return 'Erreur inconnue';
    const code = (err.code || '').toString();
    console.log('⚠️ Firebase code:', code); // log utile
    if (code.includes('invalid-email')) return 'Adresse email invalide';
    if (code.includes('user-not-found')) return "Aucun utilisateur trouvé avec cet email";
    if (code.includes('wrong-password')) return 'Mot de passe incorrect';
    if (code.includes('email-already-in-use')) return "Cet email est déjà utilisé";
    if (code.includes('weak-password')) return 'Mot de passe trop faible (minimum 6 caractères)';
    if (code.includes('network-request-failed')) return 'Erreur réseau — vérifie ta connexion';
    return err.message || 'Erreur inconnue — réessaie';
  }
 /* function parseFirebaseError(err) {
    if (!err) return 'Erreur inconnue';
    const code = (err.code || '').toString();
    const msg = (err.message || '').toString();

    if (code.includes('auth/invalid-email') || code.includes('invalid-email')) return 'Adresse email invalide';
    if (code.includes('auth/user-not-found') || code.includes('user-not-found')) return "Aucun utilisateur trouvé avec cet email";
    if (code.includes('auth/wrong-password') || code.includes('wrong-password')) return 'Mot de passe incorrect';
    if (code.includes('auth/email-already-in-use')) return "Cet email est déjà utilisé";
    if (code.includes('auth/weak-password')) return 'Mot de passe trop faible (min 6 caractères)';
    if (code.includes('auth/network-request-failed') || code.includes('network-request-failed')) return 'Erreur réseau — vérifie ta connexion';
    // fallback to message
    return msg || 'Erreur inconnue, réessaie';
  }*/

  async function onSubmit() {
    const cleanEmail = (email || '').trim().toLowerCase();
    const pwd = password || '';

    // Client-side validation
    if (!cleanEmail) {
      return Alert.alert('Validation', 'Saisis ton email');
    }
    if (!emailRegex.test(cleanEmail)) {
      return Alert.alert('Validation', 'Email invalide — vérifie le format (ex: nom@domaine.com)');
    }
    if (!pwd || pwd.length < 6) {
      return Alert.alert('Validation', 'Mot de passe invalide — au moins 6 caractères');
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await signin(cleanEmail, pwd);
        console.log('LOGIN SUCCESS', user);
        // onAuthStateChanged dans le context gère la navigation
      } else {
        const newUser = await signup(cleanEmail, pwd);
        console.log('SIGNUP SUCCESS', newUser);
        Alert.alert('Succès', 'Compte créé — tu es connecté.');
      }
    } catch (err) {
      console.log("🔥 Erreur Firebase complète :", JSON.stringify(err, null, 2));
      console.error('Auth error raw:', err);
      const parsed = parseFirebaseError(err);
      Alert.alert('Firebase', parsed);
    } finally {
      setLoading(false);
    }
  }

  async function onReset() {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return Alert.alert('Validation', 'Saisis un email valide pour la réinitialisation');
    }
    try {
      await resetPassword(cleanEmail);
      Alert.alert('Succès', 'Email de réinitialisation envoyé');
    } catch (err) {
      console.error('resetPassword error', err);
      Alert.alert('Erreur', parseFirebaseError(err));
    }
  }

  // Debug helper: will request context/auth readiness by invoking signin with invalid to see response,
  // but better: use a dedicated debug screen. For now provide a function that logs state.
  async function runQuickDiagnostics() {
    try {
      // quick fetch to check network
      const netTest = await fetch('https://www.gstatic.com/generate_204', { method: 'GET' });
      console.log('Network test status:', netTest.status);
      Alert.alert('Diagnostics réseau', `OK (status ${netTest.status})`);
    } catch (err) {
      console.error('Network test failed', err);
      Alert.alert('Diagnostics réseau', 'Échec réseau — vérifie ta connexion');
    }
    // Ask user to check Firebase console for Email/Password enabled.
    Alert.alert('Diagnostics', 'Vérifie : Firebase console → Authentication → Sign-in method → Email/Password activé.');
  }

  const colors = theme === 'dark'
    ? { bg: '#071033', card: '#0b1220', text: '#e6eef8', accent: '#06b6d4' }
    : { bg: '#f7fbff', card: '#fff', text: '#071033', accent: '#0ea5a3' };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</Text>

            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { borderColor: colors.text, color: colors.text }]}
            />

            <Text style={[styles.label, { color: colors.text }]}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, { borderColor: colors.text, color: colors.text }]}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={onSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{mode === 'login' ? 'Se connecter' : "S'inscrire"}</Text>
            </TouchableOpacity>

            {mode === 'login' && (
              <TouchableOpacity onPress={onReset} style={{ marginTop: 8 }}>
                <Text style={{ color: colors.accent, textAlign: 'center' }}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            <View style={styles.switchRow}>
              <Text style={{ color: colors.text }}>{mode === 'login' ? "Pas de compte ?" : "Déjà inscrit ?"}</Text>
              <TouchableOpacity onPress={() => setMode(m => (m === 'login' ? 'signup' : 'login'))}>
                <Text style={[styles.switchText, { color: colors.accent }]}>{mode === 'login' ? " S'inscrire" : ' Se connecter'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            {/* <TouchableOpacity onPress={runQuickDiagnostics} style={[styles.debugBtn, { borderColor: colors.accent }]}>
              <Text style={{ color: colors.accent }}>Run quick diagnostics</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={() => {
              // helpful instructions
              Alert.alert(
                'Checklist rapide',
                '1) Firebase: Auth → Sign-in method → active Email/Password\n2) Crée un utilisateur de test depuis Firebase Console (Add user)\n3) Vérifie ta config dans config/firebase.js\n4) Redémarre Metro: expo start -c'
              );
            }} style={[styles.debugBtn, { borderColor: colors.accent, marginTop: 8 }]}>
              <Text style={{ color: colors.accent }}>Show checklist</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  card: { padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  label: { marginTop: 8, marginBottom: 6 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  buttonText: { fontWeight: '800', color: '#041426' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  switchText: { fontWeight: '700' },
  debugBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center'
  }
});
