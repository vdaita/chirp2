import {StyleSheet, Text, View, TextInput} from 'react-native';
import styles from './styles';

export default function Settings(){
    return (
        <View style={styles.container}>
            <Text>
                Stories are the ephemeral sharing of moments.
                Tweets are the permanent sharing of state of mind.
                Chirps are the ephemeral sharing of state of mind.
            </Text>
            
        </View>
    )
}