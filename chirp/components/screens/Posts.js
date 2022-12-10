import { FlatList, StyleSheet, Text, View } from 'react-native';
import styles from '../../styles';
import SwitchSelector from "react-native-switch-selector";
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PostView from './../PostView';

export default function Posts(){

    const [posts, setPosts] = useEffect([]);
    const [feedSource, setFeedSource] = useEffect("recent");

    useEffect(() => {
        getFollowingData();
    }, []);

    let getFollowingData = async () => {
        let {data, error} = await supabase.rpc("get_following_posts");
        setPosts(data);
        setFeedSource("following");
    }
    
    let getRecentData = async () => {
        let {data, error} = await supabase.rpc("get_recent_posts");
        setPosts(data);
        setFeedSource("recent");
    }

    return (
        <View style={styles.container}>
            <SwitchSelector
                options={[
                    {label: "Recent", value: "recent"},
                    {label: "Following", value: "following"}
                ]}
                onPress={value => (value == "recent" ? getRecentData() : getFollowingData())}
            />
            <TouchableOpacity style={styles.button} onPress={feedSource == "following" ? getFollowingData() : getRecentData()}>
                Refresh
            </TouchableOpacity>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}
