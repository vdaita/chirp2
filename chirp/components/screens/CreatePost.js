import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Image, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from './../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';


export default function CreatePost(){
    const [postContent, setPostContent] = useState("");
    const [posted, setPosted] = useState("");

    useEffect(() => {

    }, []);
    
    let checkPosted = () => {
        // see if there is any post with today's "tag" already posted
        supabase.getAuth().then(({data: {user}}) => {
            supabase
            .from("posts")
            .select()
            .eq('posted_by', user.id)
            
        });

    }

    let post = () => {
      if(posted){
        Toast.show({
          type: 'error',
          text1: "You already posted today."
        });
      } else {
        supabase.rpc("create_post", {'user_contents': postContent}).then(({data, error}) => {
          console.log(data, error);
          if(error){
            Toast.show({
              type: 'error',
              text1: error["message"]
            })
          } else {
            setPostContent("");
            Toast.show({
              type: 'success',
              text1: 'posted successfully'
            })
          }
        });
      }
    }
  
    return (
      <View style={{...styles.container, height: 200, margin: 10, justifyContent: 'flex-start'}}>
        <Text></Text>
        {postContent.length > 0 && 
          <Image style={{height: 120, width: 90}} source={postContent}/>
        }
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Text>Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => post()}>
            <Text>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }