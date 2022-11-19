import { useEffect, useState } from 'react';
import {Text, View, TouchableOpacity, FlatList} from 'react-native';
import styles from './styles';
import Toast from 'react-native-toast-message';
import PostView from '../components/PostView';
import { supabase } from '../lib/supabase';

export default function UserProfile(props) {

    const [posts, setPosts] = useState([]);
    const [info, setInfo] = useState({});
    const [userUuid, setUserUuid] = useState("");
    const [bio, setBio] = useState("");
    const [following, setFollowing] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);


    useEffect(() => {
        getData();
    }, []);

    let getData = async () => {
        setInfo(props.user);

        supabase
          .from('user_data')
          .select()
          .eq('username', props.user.username)
          .limit(1)
          .single()
          .then(({data, error}) => {
              console.log("user profile", data, error);
              setUserUuid(data["id"]);
              setBio(data["bio"]);

            supabase.auth.getUser().then(({data: {user}}) => {
                supabase
                .from("following")
                .select()
                .eq("follower", user["id"])
                .eq("followed", data["id"])
                .then((userFollowedData) => {
                    setFollowing(userFollowedData.data.length > 0);
                    supabase.rpc("get_user_posts", {username_search: props.user.username})
                        .then((userPostData) => {
                            console.log("user posts", userPostData);
                            setPosts(userPostData.data);
                            setDataLoaded(true);
                        });
                })
            });
          });
    }


    let followUser = () => {
        supabase.rpc('follow_user', {
            to_follow: userUuid
        }).then(({data, error}) => {
            console.log("follow user", data, error);
            if(!error){
                Toast.show({
                    type: 'success',
                    text1: 'you successfully followed this user!'
                })
                setFollowing(true); 
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'error following user'
                });
            }
        });
    }

    let unfollowUser = () => {
        supabase.rpc("unfollow_user", {
            to_unfollow: userUuid
        }).then(({data, error}) => {
            console.log("unfollow user", data, error);
            if(!error){
                Toast.show({
                    type: 'success',
                    text1: 'you have successfully unfollowed this user'
                });
                setFollowing(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'error unfollowing user'
                })
            }
        });
    }

    let renderPosts = ({item, index, separators}) => (
        <PostView data={item} onUsernamePress={() => {}}/>
    )

    return (
        <View style={styles.container}>
            <Text style={{fontWeight: "bold"}}>{props.user.username}</Text>
            <Text>{bio}</Text>
            
            <TouchableOpacity disabled={!dataLoaded} style={styles.button} onPress={following ? () => unfollowUser() : () => followUser()}>
                <Text>{following ? "Unfollow User" : "Follow User"}</Text>
            </TouchableOpacity>

            <FlatList
                data={posts}
                renderItem={renderPosts}
                keyExtractor={(item) => item.id}
                />
        </View>
    )
}