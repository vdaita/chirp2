import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from './../lib/supabase';

export default function Settings(){

    const [user, setUser] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        getData();
    }, []);

    let getData = () => {
      supabase.auth.getUser().then((data) => {
          console.log("user data", data);
          const user = data["data"]["user"];
          supabase
          .from('user_data')
          .select()
          .eq('id', user["id"])
          .limit(1)
          .single()
          .then(({data, error}) => {
              console.log("settings", data, error);
              setUser(data["username"]);
              setBio(data["bio"]);
          })
      });
    }

    let updateBio = () => {
        supabase.
            from('user_data')
            .update({bio: bio})
            .eq('username', user)
            .then(({error}) => {
              if(!error){
                Toast.show({
                  type: 'success',
                  text1: "bio successfully updated"
                })
              } else {
                console.log(error);
                Toast.show({
                    type: "error",
                    text1: error.message
                });
              }
            });
    }

    return (
        <View style={styles.container}>
              <TouchableOpacity style={{...styles.button, alignSelf: "flex-start"}} onPress={() => supabase.auth.signOut()}><Text>Sign out</Text></TouchableOpacity>
            <Text >
                Stories are the ephemeral sharing of moments.
                Tweets are the permanent sharing of state of mind.
                Chirps are the ephemeral sharing of state of mind.
            </Text>
            <View style={{...styles.row, marginLeft: 0, alignContent: 'center'}}>
              <Text>Your username is</Text>
              <Text style={{fontWeight: 'bold'}}> {user}</Text>
            </View>
            <Text>Your bio is</Text>
            <TextInput style={{...styles.textInput, textAlignVertical: 'top', height: 50}} multiline={true} autoCapitalize='none' value={bio} onChangeText={(value) => setBio(value)}></TextInput>
            <TouchableOpacity onPress={() => updateBio()} style={styles.button}><Text>Update</Text></TouchableOpacity>
        
        </View>
    )
}
