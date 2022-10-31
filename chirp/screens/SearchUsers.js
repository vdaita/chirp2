import {StyleSheet, Text, TouchableOpacity, TextInput, View} from 'react-native';
import styles from './styles';
import {useState, useEffect} from 'react';

export default function SearchUsers() {

    const [users, setUsers] = useState();
    

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TextInput style={styles.textInput}></TextInput>
                <TouchableOpacity style={styles.button}><Text>Search</Text></TouchableOpacity>
            </View>
        </View>
    )
}