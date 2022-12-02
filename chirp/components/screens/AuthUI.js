import { useEffect, useState } from 'react';
import { Modal, FlatList, StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from './../lib/supabase';
import PostView from '../PostView';
import UserProfile from './../screens/UserProfile';

export default function AuthUI(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const [formType, setFormType] = useState("signup");
  
    let signup = async () => {
  
        const usernameAlreadyExists = await supabase.from('user_data').select('*', {count: 'exact', head: true}).eq('username', username);
        console.log(usernameAlreadyExists);
        if(usernameAlreadyExists["count"] == 0){
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password
            });
            console.log(data, error);
            Toast.show({
                type: 'error',
                text1: error.message
            })
  
            if(!error){
                const ret2 = await supabase.rpc('create_user', {'user_id': data["user"]["id"], 'username': username, 'bio': ''});
                console.log(ret2);
  
                if(!ret2["error"]){
                    Toast.show({
                        type: 'success',
                        text1: 'Signup successful! Please confirm your email.'
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: error.message
                    })
                }
            }
  
            
        }
    };
  
    let login = async () => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        console.log(data, error);
  
        if(error){
            Toast.show({
                type: 'error',
                text1: error.message
            });
        }
    }
  
    return (
        <SafeAreaView style={styles.childContainer}>
            <SwitchSelector
                options={[
                    {label: "Signup", value: "signup"},
                    {label: "Login", value: "login"}
                ]}
                onPress={value => setFormType(value)}
                
                textColor={'#000000'}
                selectedColor={'#FFFFFF'}
                buttonColor={"#000000"}
                borderColor={'#000000'}
                initial={0}
                hasPadding
            />
            <View>
                {formType == "signup" && 
                    <View>
                        <Text>Username</Text>
                        <TextInput autoCapitalize="none" type={"username"} value={username} onChangeText={(value) => setUsername(value)} style={styles.textInput}></TextInput>
                    </View>
                }
                <Text>Email</Text>
                <TextInput autoCapitalize="none" type={"email"} value={email} onChangeText={(value) => setEmail(value)} style={styles.textInput}></TextInput>
                <Text>Password</Text>
                <TextInput autoCapitalize="none" secureTextEntry={true} type={"password"} value={password} onChangeText={(value) => setPassword(value)} style={styles.textInput}></TextInput>
  
                <TouchableOpacity style={styles.button} onPress={formType == "signup" ? () => signup() : () => login()}>
                    <Text>{formType == "signup" ? "Signup" : "Login"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
  }