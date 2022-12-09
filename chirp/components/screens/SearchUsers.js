import {StyleSheet, Text, TouchableOpacity, TextInput, View} from 'react-native';
import styles from './styles';
import {useState, useEffect} from 'react';

export default function SearchUsers() {

    const [users, setUsers] = useState();
    const [searchQuery, setSearchQuery] = useState();

    let search = async () => {
        let {data, error} = await supabase.rpc('search_users', {
            searchquery: searchQuery
        });
        setUsers(data);
        if(error) console.error(error)
        else console.log(data)
    }

    let renderItem = ({ item }) => {
        return (
            <ProfileView username={item.username}/>
        )
    }
  
    return (
        <View style={styles.container}>
            <Text>Search Users</Text>
            <View style={styles.row}>
                <TextInput 
                    autoCapitalize="none"
                    style={{...styles.textInput, width: 300}} 
                    value={searchQuery} 
                    onChangeText={(value) => setSearchQuery(value)}>    
                </TextInput>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => search()}>
                        <Text>Search</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            >
            </FlatList>
        </View>
    )
  }
  
