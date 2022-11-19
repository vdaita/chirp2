import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from './../screens/styles';

const PostView = (props) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => props.onUsernamePress()} style={styles.row}>
                <Text style={{fontWeight: 'bold'}}>{props.data.username}</Text>
                <Text> says</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold'}}>{props.data.contents}</Text>
        </View>
    )
}

export default PostView;