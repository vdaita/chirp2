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

const Write: React.FC = () => {
    const [content, setContent] = useState("");

    const [showToast] = useIonToast();

    useEffect(() => {

    }, []);

    let post = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let {data, error} = await supabase.rpc("create_post", {"user_contents": content});
        if(error){
            showToast({message: error.message, duration: 5000});
        } else {
            setContent("");
            showToast({message: "Post successful!", duration: 5000});
        }
    }

    return (
        <IonContent>
            <form onSubmit={post}>
                <IonItem>
                    <IonLabel position="stacked">Content</IonLabel>
                    <IonInput type="text" value={content} 
                        placeholder="Content" 
                        onIonChange={(event) => {console.log(event)}}
                    />

                </IonItem>
                <div className="ion-text-center">
                    <IonButton type="submit" fill="clear">
                        Post
                    </IonButton>
                </div>
            </form>
        </IonContent>
    )
}

export default Write;