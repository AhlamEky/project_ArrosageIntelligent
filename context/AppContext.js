// context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, database } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { update } from 'firebase/database';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- Zones & thresholds ---
 /* const [pumps, setPumps] = useState([]);
  const [zones, setZones] = useState([]);
  const [thresholds, setThresholds] = useState({ moistureMin: 30, moistureMax: 80 });
*/
  // --- Données capteur et pompe ---
  const [sensor, setSensor] = useState({ soilMoisture: 0, temperature: 0, humidity: 0, pumpStatus: 'OFF' });
  const [thresholds, setThresholds] = useState({ moistureMin: 30, moistureMax: 80 });

  // --- Theme persistant ---
  const [theme, setTheme] = useState('dark');
  const THEME_KEY = '@agrimoist_theme_v1';

   // 🔹 Charger / sauvegarder le thème
  useEffect(() => { AsyncStorage.getItem(THEME_KEY).then(t => t && setTheme(t)); }, []);
  useEffect(() => { AsyncStorage.setItem(THEME_KEY, theme).catch(() => {}); }, [theme]);
 
  // --- Firebase Auth listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, email: u.email } : null);
      setAuthLoading(false);

      if (u) {
        const userRef = ref(database, `users/${u.uid}`);

        // 🔹 Écouter les données capteurs
        const sensorRef = ref(database, `users/${u.uid}/sensor`);
        onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          if (data) setSensor(data);
        });

        // 🔹 Écouter les seuils
        const thresholdsRef = ref(database, `users/${u.uid}/thresholds`);
        onValue(thresholdsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) setThresholds(data);
        });
      } else {
        setSensor({ soilMoisture: 0, temperature: 0, humidity: 0, pumpStatus: 'OFF' });
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Authentification ---
  async function signup(email, password) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      // 🔹 Créer données par défaut pour ce nouvel utilisateur
      await set(ref(database, `users/${u.uid}`), {
        sensor: { soilMoisture: 50, temperature: 25, humidity: 60, pumpStatus: 'OFF' },
        thresholds: { moistureMin: 30, moistureMax: 80 }
      });

      return u;
    } catch (err) {
      throw err;
    }
  }

  async function signin(email, password) {
    try {
      return (await signInWithEmailAndPassword(auth, email, password)).user;
    } catch (err) {
      throw err;
    }
  }

  async function signout() {
    try {
      await fbSignOut(auth);
    } catch (err) {
      throw err;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      throw err;
    }
  }

  // --- Contrôle de la pompe ---
  async function togglePump() {
    if (!user) return;
    const newStatus = sensor.pumpStatus === 'ON' ? 'OFF' : 'ON';
    await update(ref(database, `users/${user.uid}/sensor`), { pumpStatus: newStatus });
    setSensor({ ...sensor, pumpStatus: newStatus });
  }

  // --- Simuler capteur (pour test) ---
  async function randomizeSensor() {
    const newData = {
      soilMoisture: Math.max(5, Math.min(100, sensor.soilMoisture + (Math.random() * 20 - 10))),
      temperature: Math.max(10, Math.min(40, sensor.temperature + (Math.random() * 2 - 1))),
      humidity: Math.max(30, Math.min(90, sensor.humidity + (Math.random() * 5 - 2))),
    };
    setSensor({ ...sensor, ...newData });
    if (user) await update(ref(database, `users/${user.uid}/sensor`), newData);
  }

  const value = {
    user,
    authLoading,
    signup,
    signin,
    signout,
    resetPassword,
    sensor,
    thresholds,
    setThresholds,
    togglePump,
    randomizeSensor,
    theme,
    setTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
  /* useEffect(() => {
    if (!user) {
      setPumps([]);
      return;
    }
    const pumpsRef = ref(database, `users/${user.uid}/pumps`);
    const unsubscribe = onValue(pumpsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pumpsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setPumps(pumpsArray);
      } else {
        setPumps([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // --- Firebase Auth listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, email: u.email } : null);
      setAuthLoading(false);

      // Charger les zones depuis Firebase pour cet utilisateur
      if (u) {
        const zonesRef = ref(database, `users/${u.uid}/zones`);
        onValue(zonesRef, (snapshot) => {
          const data = snapshot.val() || [];
          const zonesArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setZones(zonesArray);
        });
      } else {
        setZones([]); // reset zones si déconnexion
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Auth functions ---
  async function signup(email, password) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      // Créer des données par défaut dans la DB pour ce nouvel utilisateur
      const defaultZones = [
        { id: 'z1', name: 'Zone 1', moisture: 50 },
        { id: 'z2', name: 'Zone 2', moisture: 50 },
        { id: 'z3', name: 'Zone 3', moisture: 50 }
      ];
      await set(ref(database, `users/${u.uid}/zones`), defaultZones);

      return u;
    } catch (err) { throw err; }
  }

  async function signin(email, password) {
    try { return (await signInWithEmailAndPassword(auth, email, password)).user; }
    catch (err) { throw err; }
  }

  async function signout() { try { await fbSignOut(auth); } catch (err) { throw err; } }
  async function resetPassword(email) { try { await sendPasswordResetEmail(auth, email); return true; } catch(err){throw err;} }

  // --- Dashboard functions ---
  function randomizeSensors() {
    const updatedZones = zones.map(z => ({
      ...z,
      moisture: Math.max(5, Math.min(100, z.moisture + (Math.round(Math.random() * 40) - 20)))
    }));
    setZones(updatedZones);

    if(user) {
      updatedZones.forEach(zone => {
        set(ref(database, `users/${user.uid}/zones/${zone.id}`), zone);
      });
    }
  }

  const value = { user, authLoading, signup, signin, signout, resetPassword,
                  zones, randomizeSensors, thresholds, theme, setTheme, pumps, setPumps };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
} */
  