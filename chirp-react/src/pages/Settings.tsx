import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonToggle,
    useIonToast,
    useIonLoading
} from '@ionic/react';
import { supabase } from '../supabaseClient';

export function Settings(){
    const [bio, setBio] = useState("");
    const [initialBio, setInitialBio] = useState("");
    const [username, setUsername] = useState("");

    const [showToast] = useIonToast();
    const [showLoading, hideLoading] = useIonLoading();

    useEffect(() => {
        getUserData();
    }, []);

    const signUserOut = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        const {error} = await supabase.auth.signOut();
        if(error){
            await showToast({message: error.message, duration: 5000});
        }
        await hideLoading();
    }

    const getUserData = async() => {
        const {data: {user}} = await supabase.auth.getUser();
        const {data, error} = await supabase.from("user_data")
                                    .select()
                                    .eq("id", user?.id);

        if(error){
            await showToast(error.message, 5000);
        } else {
            setUsername(data[0]["username"]);
            setInitialBio(data[0]["bio"]);
            setBio(data[0]["bio"]);
        }
    }

    const updateBio = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await showLoading();
        
        const {data: {user}} = await supabase.auth.getUser();
        const {data, error} = await supabase.rpc("update_bio", {"user_id": user?.id, "new_bio": bio});
        await hideLoading();
        if(error){
            await showToast(error.message, 5000);
        }
    }

    return (
        <IonContent>
            <form onSubmit={updateBio}>
                <h1>{username}</h1>
                <IonInput value={initialBio}
                        name={"bio"}
                        onIonChange={(e) => setBio(e.detail.value ?? '')}
                        type="text"/>
                <div className="ion-text-center">
                    <IonButton type="submit">
                        Update bio
                    </IonButton>
                </div>
            </form>
            
            <form onSubmit={signUserOut}>
                <IonButton type="submit">
                    Sign out
                </IonButton>
            </form>
        </IonContent>
    )
}