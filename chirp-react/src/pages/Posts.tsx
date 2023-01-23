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
    IonRow,
    useIonToast,
    useIonLoading,
    IonCol
} from '@ionic/react';
import { supabase } from '../supabaseClient';

export function Posts(){
    const [posts, setPosts] = useState<any[]>([]);
    const [source, setSource] = useState("recent");

    const [showToast] = useIonToast();

    useEffect(() => {
        getPosts("recent");
    }, [])

    const getPosts = async (source: string) => {
        if(source == "recent"){
            let {data, error} = await supabase.rpc("get_following_posts");
            if(data == null){
                data = [];
            }
            setPosts(data)
            if(error != null){
                await showToast({message: error.message, duration: 5000});
            }
            setSource("recent")
        } else {
            let {data, error} = await supabase.rpc("get_recent_posts");
            if(data == null){
                data = [];
            }
            setPosts(data);
            if(error != null){
                await showToast({message: error.message, duration: 5000});
            }
            setSource("following")
        }
    }

    const switchToFollowing = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getPosts("following")
        setSource("following");
    }

    const switchToRecent = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getPosts("recent");
        setSource("recent");
    }

    return (
        <IonContent>
            <IonText>
                <h2>{source == "recent" ? "Recent" : "Following"}</h2>
            </IonText>
            <IonRow>
                <div className="ion-padding">
                    {source == "recent" && 
                        <form onSubmit={switchToFollowing}>
                            <IonButton type="submit" fill="outline">Switch to Following</IonButton>
                        </form>
                    }
                    {source == "following" &&
                        <form onSubmit={switchToRecent}>
                            <IonButton type="submit" fill="outline">Switch to Recent</IonButton>
                        </form>
                    }
                </div>
                <div className="ion-padding">
                    <form onSubmit={source == "recent" ? switchToRecent : switchToFollowing}>
                        <IonButton type="submit" fill="outline">Refresh</IonButton>
                    </form>
                </div>
            </IonRow>

            {posts.length == 0 && <IonText>No posts found</IonText>}
            <IonList inset={true}>
                {
                    posts.map(post => {
                        return (
                            <IonItem>
                                <IonCol>
                                    <IonText>
                                        <h3>{post["username"]}</h3>
                                    </IonText>
                                    <IonText>
                                        <h5>{post["created_at"]}</h5>
                                    </IonText>
                                    <IonText>
                                        {post["contents"]}
                                    </IonText>
                                </IonCol>
                            </IonItem>
                        )
                    })
                }
            </IonList>
        </IonContent>
    )
}