import React, { useEffect, useState } from 'react';
import {Container, Button, Box, Input, Text, useToast} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

export function Settings(){
    const [bio, setBio] = useState("");
    const [initialBio, setInitialBio] = useState("");
    const [username, setUsername] = useState("");

    const showToast = useToast();

    useEffect(() => {
        getUserData();
    }, []);

    const signUserOut = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {error} = await supabase.auth.signOut();
        if(error){
            showToast({title: error.message, duration: 5000});
        }
    }

    const getUserData = async() => {
        const {data: {user}} = await supabase.auth.getUser();
        const {data, error} = await supabase.from("user_data")
                                    .select()
                                    .eq("id", user?.id);

        if(error){
            showToast({title: error.message, duration: 5000});
        } else {
            setUsername(data[0]["username"]);
            setInitialBio(data[0]["bio"]);
            setBio(data[0]["bio"]);
        }
    }

    const updateBio = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const {data: {user}} = await supabase.auth.getUser();
        const {data, error} = await supabase.rpc("update_bio", {"user_id": user?.id, "new_bio": bio});
        if(error){
            showToast({title: error.message, duration: 5000});
        }
    }

    return (
        <Container>
            <form onSubmit={updateBio}>
                <h1>{username}</h1>
                <Input value={initialBio}
                        name={"bio"}
                        onChange={(e) => setBio(e.target.value ?? '')}
                        type="text"/>
                <div className="ion-text-center">
                    <Button type="submit">
                        Update bio
                    </Button>
                </div>
            </form>
            
            <form onSubmit={signUserOut}>
                <Button type="submit">
                    Sign out
                </Button>
            </form>
        </Container>
    )
}