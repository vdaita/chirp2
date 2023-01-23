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
    IonText,
    IonToggle,
    useIonToast,
    useIonLoading,
    IonCol,
    IonRow
} from '@ionic/react';
import { supabase } from '../supabaseClient';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

interface UserDetailProfileProps extends RouteComponentProps<{
    username: string;
}>{}

const UserDetailProfile: React.FC<UserDetailProfileProps> = ({match}) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [information, setUserInformation] = useState<any>();

    const [showToast] = useIonToast();

    useEffect(() => {
        getUserInformation();
        getPosts(match.params.username);
    }, []);

    const getUserInformation = async() => {
        let {data, error} = await supabase.rpc("get_user_data", {"search_username": match.params.username});
        if(data == null){
            data = [];
        }
        setUserInformation(data);
        if(error != null){
            await showToast({message: error.message, duration: 5000});
        }
    }

    const getPosts = async (uid: string) => {
        let {data, error} = await supabase.rpc("get_user_posts");
        if(data == null){
            data = [];
        }
        setPosts(data)
        if(error != null){
            await showToast({message: error.message, duration: 5000});
        }    
    }

    const followUser = async() => {
        let {data, error} = await supabase.rpc("");
        if(error != null){
            await showToast({message: error.message, duration: 5000});
        } else {
            var updatedInformation = {...information};
            updatedInformation["followed"] = true;
            setUserInformation(updatedInformation);
        }
    }

    const unfollowUser = async() => {
        let {data, error} = await supabase.rpc("");
        if(error != null){
            await showToast({message: error.message, duration: 5000});
        } else {
            var updatedInformation = {...information};
            updatedInformation["followed"] = false;
            setUserInformation(updatedInformation);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonTitle>{information["username"]}</IonTitle>
            </IonHeader>
            <IonContent>
                <IonText><h2>{information["bio"]}</h2></IonText>
                <IonRow>
                    {information["followed"] && <IonButton onClick={() => unfollowUser()}>Unfollow</IonButton>}
                    {!information["followed"] && <IonButton onClick={() => followUser()}>Follow</IonButton>}
                </IonRow>
                <IonList inset={true}>
                    {
                        posts.map(post => {
                            return (
                                <IonItem>
                                    <IonCol>
                                        <IonText>
                                            <h3>{post["username"]}</h3>
                                            <h5>{post["created_at"]}</h5>
                                            {post["contents"]}
                                        </IonText>
                                    </IonCol>    
                                </IonItem>
                            )
                        })
                    }
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default UserDetailProfile;