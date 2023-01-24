import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Box,
    Text,
    VStack,
    HStack,
    List,
    ListItem,
    useToast
} from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

export function Posts(){
    const [posts, setPosts] = useState<any[]>([]);
    const [source, setSource] = useState("recent");

    const showToast = useToast();

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
                showToast({title: error.message, duration: 5000});
            }
            setSource("recent")
        } else {
            let {data, error} = await supabase.rpc("get_recent_posts");
            if(data == null){
                data = [];
            }
            setPosts(data);
            if(error != null){
                showToast({title: error.message, duration: 5000});
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
        <Container>
            <Text>
                <h2>{source == "recent" ? "Recent" : "Following"}</h2>
            </Text>
            <HStack>
                <div className="ion-padding">
                    {source == "recent" && 
                        <form onSubmit={switchToFollowing}>
                            <Button type="submit" fill="outline">Switch to Following</Button>
                        </form>
                    }
                    {source == "following" &&
                        <form onSubmit={switchToRecent}>
                            <Button type="submit" fill="outline">Switch to Recent</Button>
                        </form>
                    }
                </div>
                <div className="ion-padding">
                    <form onSubmit={source == "recent" ? switchToRecent : switchToFollowing}>
                        <Button type="submit" fill="outline">Refresh</Button>
                    </form>
                </div>
            </HStack>

            {posts.length == 0 && <Text>No posts found</Text>}
            <List>
                {
                    posts.map(post => {
                        return (
                            <ListItem>
                                <VStack>
                                    <Text>
                                        <h3>{post["username"]}</h3>
                                    </Text>
                                    <Text>
                                        <h5>{post["created_at"]}</h5>
                                    </Text>
                                    <Text>
                                        {post["contents"]}
                                    </Text>
                                </VStack>
                            </ListItem>
                        )
                    })
                }
            </List>
        </Container>
    )
}