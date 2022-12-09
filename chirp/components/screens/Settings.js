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
