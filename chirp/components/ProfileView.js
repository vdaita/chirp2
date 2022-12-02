import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from './../screens/styles';

const ProfileView = (props) => {

    const [following, setFollowing] = useState(false);

    let followUser = () => {
        supabase.rpc('follow_user', {
            to_follow: userUuid
        }).then(({data, error}) => {
            console.log("follow user", data, error);
            if(!error){
                setFollowing(true);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'error following user'
                })
            }
        });
    }

    let unfollowUser = () => {
        supabase.rpc('unfollow_user', {
            to_unfollow: userUuid
        }).then(({data, error}) => {
            console.log("unfollow user", data, error);
            if(!error){
                setFollowing(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'error unfollowing user'
                })
            }
        });
    }

    return (
        <View style={styles.card}>
            <Text style={{fontWeight: "bold"}}>{props.user.username}</Text>
            <Text>{props.user.bio}</Text>
            <TouchableOpacity style={styles.button} onPress={following ? followUser() : unfollowUser()}>
                <Text>{following ? "unfollow" : "follow"}</Text>
            </TouchableOpacity>
        </View>
    )
}