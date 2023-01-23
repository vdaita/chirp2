import React, { ReactText, useState } from 'react';
import { supabase } from '../supabaseClient';
import {Container, Text, Button, Box, Input, useToast} from '@chakra-ui/react';

export default function Authentication(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('');
    const [actionType, setActionType] = useState('login');

    const showToast = useToast();
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log();
        e.preventDefault();
        try {
            const {data, error} = await supabase.auth.signInWithPassword({email: email, password: password});
            console.log("login request", data, error);
            if(error){
                throw error;
            }
        } catch (e: any){
            showToast({title: e.error_description || e.message, duration: 5000});
        }
    };

    const isUsernameRegistered = async() => {
        const {data, error} = await supabase
            .from('user_data')
            .select()
            .eq('username', username);

        if(error){
            showToast({title: error.message, duration: 5000});
        }

        console.log("username registered ", data, error);

        if(data != null){
            return data.length > 0;
        } else {
            return false;
        }
    }

    const handleSignup = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log();
        e.preventDefault();

        // check whether or not the username exists
        const usernameRegistered = await isUsernameRegistered();
        
        if(usernameRegistered){
            showToast({title: "Username already taken!", duration: 5000});
        } else {
            try {
                const {data, error} = await supabase.auth.signUp({
                    email: email, 
                    password: password
                });
                console.log("signup request ", data, error);
                if(error){
                    throw error;
                }
            } catch (e: any){
                console.log("going to show error toast ", e);
                showToast({title: e.error_description || e.message, duration: 5000});
            }
        }
    }

    const switchToSignup = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setActionType("signup");
    }

    const switchToLogin = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setActionType("login");
    }

    return (
        <Container>
            <Box>
                <Text>
                    <h1>{actionType == "login" ? "Login" : "Signup"}</h1>
                </Text>
                <div className="ion-padding">
                    {actionType == "login" && 
                        <form onSubmit={switchToSignup}>
                            <Button type="submit" fill="outline">Switch to Signup</Button>
                        </form>
                    }
                    {actionType == "signup" &&
                        <form onSubmit={() => switchToLogin}>
                            <Button type="submit" fill="outline">Switch to Login</Button>
                        </form>
                    }
                </div>
                <form onSubmit={actionType == "login" ? handleLogin : handleSignup}>
                    <Box>
                        <Text>Email</Text>
                        <Input value={email}
                                name={"email"}
                                onChange={(e) => setEmail(e.target.value ?? '')}
                                type="email"/>
                    </Box>
                    {actionType == "signup" &&
                        <Box>
                            <Text>Username</Text>
                            <Input value={username}
                                name={"username"}
                                onChange={(e) => setUsername(e.target.value ?? '')}
                                type="text"/>
                        </Box>
                    }
                    <Box>
                        <Text>Password</Text>
                        <Input value={password}
                                name={"password"}
                                onChange={(e) => setPassword(e.target.value ?? '')}
                                type="password"/>
                    </Box>
                    <div className="ion-text-center">
                        <Button type="submit">
                            {actionType == "signup" ? "Signup" : "Login"}
                        </Button>
                    </div>

                </form>
            </Box>
        </Container>

    )


}