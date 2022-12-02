import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from './../lib/supabase';
import PostView from '../PostView';
import UserProfile from './../screens/UserProfile';

export default function Posts(){

    const [posts, setPosts] = useState([]);
    const [feedSource, setFeedSource] = useState("recent");
  
    const [currentUserProfile, setCurrentUserProfile] = useState(false);
    const [currentUserProfileVisible, setCurrentUserProfileVisible] = useState(false);
  
    useEffect(() => {
        getRecentData();
        console.log("posts use effect");
    }, []);
  
    let getFollowingData = () => {
        console.log("running get following data");
        supabase.rpc("get_following_posts").then(({data, error}) => {
            setPosts(data);
            console.log(data, error);
            setFeedSource("following");
        });
    }
    
    let getRecentData =  () => {
        console.log("running get recent data")
        supabase.rpc("get_recent_posts").then(({data, error}) => {
            setPosts(data);
            console.log(data, error);
            setFeedSource("recent");
        });
    }
  
    let refresh = () => {
        if(feedSource == "following"){
            getFollowingData();
        } else {
            getRecentData();
        }
    }
  
    let showModal = (item) => {
      setCurrentUserProfile(item);
      setCurrentUserProfileVisible(true);
    }
  
    let renderItem = ({item, index, separators}) => (
        <PostView data={item} onUsernamePress={() => showModal(item)}/>
    )
  
    return (
        <View style={styles.container}>
            <SwitchSelector
                initial={0}
                options={[
                    {label: "Recent", value: "recent"},
                    {label: "Following", value: "following"}
                ]}
                onPress={value => (value == "recent" ? getRecentData() : getFollowingData())}
                
                textColor={'#000000'}
                selectedColor={'#FFFFFF'}
                buttonColor={"#000000"}
                borderColor={'#000000'}
                hasPadding
            />
            {/* <Text>{feedSource}</Text> */}
            <TouchableOpacity style={styles.button} onPress={() => refresh()}>
                <Text>
                    Refresh
                </Text>
            </TouchableOpacity>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
  }
  
  