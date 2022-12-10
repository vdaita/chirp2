import { StatusBar } from 'expo-status-bar';

import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import styles from './components/screens/styles';
import { supabase } from './lib/supabase';
import SwitchSelector from "react-native-switch-selector";
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import CreatePost from './components/screens/CreatePost';
import Settings from './components/screens/Settings';
import AuthUI from './components/screens/AuthUI';
import Posts from './components/screens/Posts';
import SearchUsers from './components/screens/SearchUsers';

export default function App() {

  const [session, setSession] = useState();
  const [currentScreen, setCurrentScreen] = useState();

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if(session && session.user) {
    return (
      <AuthUI/>
    )
  }

  return (
    <View style={styles.container}>
      {
        currentScreen == "posts" && 
        <Posts/>
      }
      {
        currentScreen == "search" && 
        <SearchUsers/>
      }
      {
        currentScreen == "create" &&
        <CreatePost/>
      }
      {
        currentScreen == "settings" &&
        <Settings/>
      }
      <View style={styles.bottom}>
        <View style={styles.row}>
          <Icon
            onPress={() => setCurrentScreen("posts")}
          />
          <Icon
            onPress={() => setCurrentScreen("search")}
          />
          <Icon 
            onPress={() => setCurrentScreen("create")}
          />
          <Icon
            onPress={() => setCurrentScreen("settings")}
          />
        </View>
      </View>
      <Toast/>
    </View>
  );
}

