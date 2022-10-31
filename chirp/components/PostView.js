import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from './styles';

const PostView = (props) => {
    return (
        <View style={styles.card}>
            <Text style={{fontWeight: 'bold'}}>{props.data.}</Text>
            <Text style={{fontWeight: 'bold'}}>{props.data.}</Text>
        </View>
    )
}

export default PostView;