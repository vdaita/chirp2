import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import styles from './../screens/styles';

const PostView = (props) => {
    return (
        <View style={styles.card}>
            <ProfileView/>
            <Image source={props.image}/>
        </View>
    )
}

export default PostView;