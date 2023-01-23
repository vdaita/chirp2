import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonCol,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonToggle,
    useIonToast,
    IonText,
    useIonLoading
} from '@ionic/react';
import { supabase } from '../supabaseClient';

export function Search(){
    const [users, setUsers] = useState<any[]>([]);
    const [query, setQuery] = useState("");

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let {data, error} = await supabase.rpc('search_users', {
            searchquery: query
        });
        if(data == null){
            data = [];
        }
        setUsers(data);
    }

    return (
        <IonContent>
            <form onSubmit={search}>
                <IonItem>
                    <IonLabel position="stacked">Search Term</IonLabel>
                    <IonInput
                            name={"query"}
                            onIonChange={(e) => setQuery(e.detail.value ?? '')}
                            type="text"/>
                    <IonButton type="submit" fill="clear">
                        Search
                    </IonButton>
                </IonItem>
            </form>
            {users.map(user => {
                return (
                    <IonItem>
                        <IonCol>
                            <IonText>
                                <h3>{user["username"]}</h3>
                            </IonText>
                            <IonText>
                                {user["bio"]}
                            </IonText>
                        </IonCol>
                    </IonItem>
                )
            })}
        </IonContent>
    )
}