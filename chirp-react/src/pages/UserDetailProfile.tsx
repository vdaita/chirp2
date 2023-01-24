import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    List,
    ListItem,
    VStack,
    HStack,
    Box,
    Input,
    Text,
    Heading,
    useToast
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { 
    createBrowserRouter,
    RouterProvider
 } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: "/",
        element: <div></div>
    }
])

export function UserDetailProfile(){
    const [posts, setPosts] = useState<any[]>([]);
    const [information, setUserInformation] = useState<any>();

    const showToast = useToast();

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
        <Container>
            <Heading>
                {information["username"]}
            </Heading>
            <Box>
                <Text><h2>{information["bio"]}</h2></Text>
                <HStack>
                    {information["followed"] && <Button onClick={() => unfollowUser()}>Unfollow</Button>}
                    {!information["followed"] && <Button onClick={() => followUser()}>Follow</Button>}
                </HStack>
                <List>
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
                </List>
            </Box>
        </Container>
    )
}

export default UserDetailProfile;