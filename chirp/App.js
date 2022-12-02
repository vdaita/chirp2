import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import UserProfile from './screens/UserProfile';
import styles from './screens/styles';
import { supabase } from './lib/supabase';
import PostView from './components/PostView';
import SwitchSelector from "react-native-switch-selector";
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import CreatePost from './components/screens/CreatePost';
import Settings from './components/screens/Settings';
import AuthUI from './components/screens/AuthUI';
import Posts from './components/screens/Posts';
import SearchUsers from './components/screens/SearchUsers';

export default function App() {

  const [session, setSession] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("posts");

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN'){
        // console.log('SIGNED_IN', session)
        setSession(true);
      }
      if (event == 'SIGNED_OUT'){
        // console.log('SIGNED_OUT', session);
        setSession(false);
      }
    })
  })

  if(session){
    return (
      <SafeAreaView style={{flex: 1}}>

        {currentScreen == "posts" && <Posts/>}
        {currentScreen == "write" && <CreatePost/>}
        {currentScreen == "search" && <SearchUsers/>}
        {currentScreen == "settings" && <Settings/>}


        <View style={{justifyContent: "flex-end"}}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="list" onPress={() => setCurrentScreen("posts")} size={30}>
              </Icon.Button> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="edit" onPress={() => setCurrentScreen("write")} size={30}>
              </Icon.Button>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="search" onPress={() => setCurrentScreen("search")} size={30}>

              </Icon.Button>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Icon.Button backgroundColor="#000000" name="settings" onPress={() => setCurrentScreen("settings")} size={30}>

              </Icon.Button>
            </TouchableOpacity>
          </View>
        </View>

        <Toast/>
      </SafeAreaView>
    )
  }

  return (
    <View>
      <AuthUI/>
      <Toast/>
    </View>
  )
}

